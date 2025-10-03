import Image from 'next/image'

export default function Logo({ width, height, isWhite }) {
  return (
    <Image src={`${!isWhite ? '/Streemo-logo-dark.svg' : '/Streemo-logo-white.svg'}`} width={width} height={height} alt="Lg Streemo" />
  )
}
