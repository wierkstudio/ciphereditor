
import './logo.scss'
import { mulberry32 } from '../../lib/utils/random'
import { shuffleArray } from '../../lib/utils/array'
import { useId, useState } from 'react'

const crossPath = 'M7.01444 8.83393L9.15162 11H11V9.15162L8.83393 6.98556L11 4.84838V3H9.15162L7.01444 5.16606L4.84838 3H3V4.84838L5.16606 6.98556L3 9.15162V11H4.84838L7.01444 8.83393Z'
const circlePath = 'M7 2.535C4.5361 2.535 2.536 4.54207 2.536 6.98546C2.536 9.42885 4.5361 11.465 7 11.465C9.46389 11.465 11.464 9.45794 11.464 6.98546C11.464 4.51298 9.43491 2.535 7 2.535Z'
const squarePath = 'M11 3H3V11H11V3Z'

export default function LogoView (props: {}): JSX.Element {
  const [seed, setSeed] = useState(0)
  const prng = mulberry32(seed)
  const svgTitleId = useId()

  const positions = ['0,11', '11,22', '22,0', '0,22', '11,0', '22,22']
  if (seed > 0) {
    shuffleArray(positions, prng)
  }

  return (
    <button onClick={(evt) => setSeed(seed + 1)} className='logo'>
      <h1 className='logo__canvas'>
        <svg
          className='logo__svg'
          width='36'
          height='36'
          viewBox='0 0 36 36'
          role='img'
          aria-labelledby={svgTitleId}
        >
          <title id={svgTitleId}>ciphereditor</title>
          <path className='logo__svg-cross-1' transform={`translate(${positions[0]})`} d={crossPath} />
          <path className='logo__svg-cross-2' transform={`translate(${positions[1]})`} d={crossPath} />
          <path className='logo__svg-circle-1' transform={`translate(${positions[2]})`} d={circlePath} />
          <path className='logo__svg-circle-2' transform={`translate(${positions[3]})`} d={circlePath} />
          <path className='logo__svg-square-1' transform={`translate(${positions[4]})`} d={squarePath} />
          <path className='logo__svg-square-2' transform={`translate(${positions[5]})`} d={squarePath} />
        </svg>
      </h1>
    </button>
  )
}
