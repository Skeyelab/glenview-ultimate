import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { describe, it, expect, vi } from 'vitest'

vi.mock('next/image', () => ({ __esModule: true, default: (props: any) => <img {...props} /> }))
// eslint-disable-next-line import/first
import { PhotoLightbox, type LightboxPhoto } from '@/components/team-photos/photo-lightbox'

const photos: LightboxPhoto[] = [
  { id: 1, title: 'First', thumbSrc: '/t1.jpg', fullSrc: '/f1.jpg', alt: 'First' },
  { id: 2, title: 'Second', thumbSrc: '/t2.jpg', fullSrc: '/f2.jpg', alt: 'Second' },
  { id: 3, title: null, thumbSrc: '/t3.jpg', fullSrc: '/f3.jpg', alt: '2026 Season team photo' },
]

describe('PhotoLightbox', () => {
  it('renders one clickable trigger per photo, with no dialog open', () => {
    render(<PhotoLightbox photos={photos} />)

    expect(screen.getAllByRole('button', { name: /view larger/i })).toHaveLength(3)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the clicked photo at full size', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)

    await user.click(screen.getAllByRole('button', { name: /view larger/i })[1])

    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByRole('img')).toHaveAttribute('src', '/f2.jpg')
  })

  it('closes on Escape', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('advances with next and wraps past the last photo', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[2])

    await user.click(screen.getByRole('button', { name: /next/i }))

    expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('src', '/f1.jpg')
  })

  it('goes back with previous and wraps before the first photo', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])

    await user.click(screen.getByRole('button', { name: /previous/i }))

    expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('src', '/f3.jpg')
  })

  it('navigates with the arrow keys', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])

    await user.keyboard('{ArrowRight}')
    expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('src', '/f2.jpg')

    await user.keyboard('{ArrowLeft}')
    expect(within(screen.getByRole('dialog')).getByRole('img')).toHaveAttribute('src', '/f1.jpg')
  })

  it('returns focus to the photo that opened it', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    const trigger = screen.getAllByRole('button', { name: /view larger/i })[1]
    await user.click(trigger)

    await user.keyboard('{Escape}')

    expect(trigger).toHaveFocus()
  })

  it('moves focus into the dialog when it opens', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    const trigger = screen.getAllByRole('button', { name: /view larger/i })[1]

    await user.click(trigger)

    // Without this a screen reader user stays outside the modal and Tab walks
    // the page behind it.
    expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement)
    expect(trigger).not.toHaveFocus()
  })

  it('closes with a visible close control', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])

    await user.click(screen.getByRole('button', { name: /close/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('shows the caption of the photo currently open', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])

    expect(within(screen.getByRole('dialog')).getByText('First')).toBeInTheDocument()

    await user.keyboard('{ArrowRight}')

    expect(within(screen.getByRole('dialog')).getByText('Second')).toBeInTheDocument()
  })

  it('closes when the backdrop is clicked but not when the photo is', async () => {
    const user = userEvent.setup()
    render(<PhotoLightbox photos={photos} />)
    await user.click(screen.getAllByRole('button', { name: /view larger/i })[0])

    await user.click(within(screen.getByRole('dialog')).getByRole('img'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
