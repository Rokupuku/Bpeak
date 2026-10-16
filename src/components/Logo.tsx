import logo from '../assets/logo.png'

export function Logo({ variant = 'header' }: { variant?: 'header' | 'splash' }) {
  return (
    <img
      className={variant === 'splash' ? 'logo-mark' : 'logo-header'}
      src={logo}
      alt="Bpeak"
      draggable={false}
    />
  )
}
