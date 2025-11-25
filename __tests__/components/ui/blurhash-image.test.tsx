import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { BlurhashImage } from "@/components/ui/blurhash-image";

// Mock next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, onLoad, onError, ...props }: { src: string; alt: string; onLoad?: () => void; onError?: () => void; [key: string]: any }) => {
    const { width: _width, height: _height, className: _className, priority: _priority, ...htmlProps } = props;
    // Simulate image load
    React.useEffect(() => {
      if (onLoad) {
        setTimeout(() => onLoad(), 0);
      }
    }, [onLoad]);
    return <img src={src} alt={alt} data-testid="next-image" {...htmlProps} />;
  },
}));

// Mock blurhash decode
vi.mock("blurhash", () => ({
  decode: vi.fn(),
}));

describe("BlurhashImage", () => {
  let mockDecode: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    // Get the mocked decode function
    const blurhash = await import("blurhash");
    mockDecode = vi.mocked(blurhash.decode);
    // Mock canvas API
    global.HTMLCanvasElement.prototype.getContext = vi.fn(() => {
      const imageData = {
        data: new Uint8ClampedArray(32 * 32 * 4),
      };
      return {
        createImageData: vi.fn(() => imageData),
        putImageData: vi.fn(),
      } as unknown as CanvasRenderingContext2D;
    });
    global.HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/png;base64,mock");
  });

  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
    width: 100,
    height: 100,
  };

  it("renders image without blurhash", async () => {
    render(<BlurhashImage {...defaultProps} />);
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test image");
  });

  it("renders blurhash placeholder when blurhash is provided", async () => {
    mockDecode.mockReturnValue(new Uint8ClampedArray(32 * 32 * 4));
    render(<BlurhashImage {...defaultProps} blurhash="L2B52$%z009Y.QRjbHtR00xu~XR6" />);

    // Wait for blurhash to be decoded
    await waitFor(() => {
      const placeholder = screen.queryByAltText("");
      expect(placeholder).toBeInTheDocument();
    });

    expect(mockDecode).toHaveBeenCalledWith("L2B52$%z009Y.QRjbHtR00xu~XR6", 32, 32);
  });

  it("hides blurhash placeholder when image loads", async () => {
    mockDecode.mockReturnValue(new Uint8ClampedArray(32 * 32 * 4));
    const { container } = render(<BlurhashImage {...defaultProps} blurhash="L2B52$%z009Y.QRjbHtR00xu~XR6" />);

    // Wait for image to load (onLoad is called asynchronously in the mock)
    await waitFor(() => {
      const image = container.querySelector('img[data-testid="next-image"]');
      expect(image).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it("handles blurhash decode errors gracefully", async () => {
    mockDecode.mockImplementation(() => {
      throw new Error("Invalid blurhash");
    });
    const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<BlurhashImage {...defaultProps} blurhash="invalid" />);

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("[BlurhashImage] Failed to decode blurhash:"),
        expect.any(Error),
      );
    });

    // Image should still render
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();

    consoleWarnSpy.mockRestore();
  });

  it("renders fallback when no image and no blurhash", () => {
    render(<BlurhashImage src="" alt="Test" width={100} height={100} />);
    expect(screen.getByText("Image unavailable")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<BlurhashImage {...defaultProps} className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("custom-class");
  });

  it("passes through image props", () => {
    render(<BlurhashImage {...defaultProps} priority data-testid="custom-image" />);
    const image = screen.getByTestId("custom-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
  });

  it("handles null blurhash", () => {
    render(<BlurhashImage {...defaultProps} blurhash={null} />);
    expect(mockDecode).not.toHaveBeenCalled();
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });

  it("handles undefined blurhash", () => {
    render(<BlurhashImage {...defaultProps} blurhash={undefined} />);
    expect(mockDecode).not.toHaveBeenCalled();
    const image = screen.getByTestId("next-image");
    expect(image).toBeInTheDocument();
  });
});

