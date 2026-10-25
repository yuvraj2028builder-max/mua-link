import { Link } from 'react-router'

export default function Logo({ light = false, to = '/' }: { light?: boolean; to?: string }) {
  return (
    <Link to={to} className={`brand ${light ? 'brand-light' : ''}`} aria-label="MUALink home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
      <span>MUA<span>Link</span></span>
    </Link>
  )
}
