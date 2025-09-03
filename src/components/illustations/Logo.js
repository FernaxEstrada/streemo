import Image from 'next/image'

export default function Logo({ width, height, altura, isWhite }) {
  return (
    <Image src={`${!isWhite ? '/Streemo-logo-dark.svg' : '/Streemo-logo-white.svg'}`} width={width} height={height} alt="Lg Streemo" className={`h-${altura}`} />
  )
}
