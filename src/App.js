import React, { useState, useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import Graph from './Graph'
import './App.css'

const spiralXGen = density => angle => (Math.cos(angle) * angle) / density
const spiralYGen = density => angle => (Math.sin(angle) * angle) / density
const evalFn = (input, setBody, setFn) => {
	setBody(input)
	const fn = `(angle, density) => ${input}`
	setFn(fn)
}

function App() {
	const [fXBody, setFXBody] = useState('')
	const [fYBody, setFYBody] = useState('')
	const [density, setDensity] = useState(0.7)
	const [detail, setDetail] = useState(30)
	const [sizeX, setSizeX] = useState(100)
	const [sizeY, setSizeY] = useState(50)
	const sizeXRef = useRef(sizeX)
	const sizeYRef = useRef(sizeY)
	const [fX, setFX] = useState(() => (angle, x, y) =>
		Math.pow(Math.cos(x / sizeXRef.current), 2) *
		Math.cos(y / sizeXRef.current) *
		Math.sin(y / sizeXRef.current) *
		sizeXRef.current
	)
	const [fY, setFY] = useState(() => (angle, x, y) =>
		Math.sin(x / sizeYRef.current) *
		Math.cos(x / sizeYRef.current) *
		Math.sin(y / sizeYRef.current) *
		Math.cos(y / sizeXRef.current) *
		sizeYRef.current
	)
	// 	const [fY, setFY] = useState(() => (angle, x, y) =>
	// 	Math.sin(x / sizeYRef.current) *
	// 	Math.cos(x / sizeYRef.current) *
	// 	Math.sin(y / sizeYRef.current) *
	// 	Math.tan(y / sizeXRef.current) *
	// 	sizeYRef.current
	// )
	const [angleRange, setAngleRange] = useState([0, 1000])
	const [spiralX, setSpiralX] = useState(() => spiralXGen(density))
	const [spiralY, setSpiralY] = useState(() => spiralYGen(density))
	useEffect(() => {
		setSpiralX(() => spiralXGen(density))
		setSpiralY(() => spiralYGen(density))
	}, [density])

	return (
		<div className="App">
			<Sidebar>
				<h1>Spiral explorer</h1>
				<label>
					fX(angle, x, y):
					<input
						type="text"
						value={fXBody}
						onChange={e => evalFn(e.target.value, setFXBody, setFX)}
					/>
				</label>
				<label>
					fY(angle, x, y):
					<input
						type="text"
						value={fYBody}
						onChange={e => evalFn(e.target.value, setFYBody, setFY)}
					/>
				</label>
				<label>
					density
					<input
						type="number"
						value={density}
						onChange={e => setDensity(+e.target.value)}
						min={0}
						step={0.1}
					/>
				</label>
				<label>
					detail
					<input
						type="number"
						value={detail}
						onChange={e => setDetail(+e.target.value)}
					/>
				</label>
				<label>
					size x
					<input
						type="number"
						value={sizeX}
						onChange={e => {
							const newValue = +e.target.value
							setSizeX(newValue)
							sizeXRef.current = newValue
						}}
						min={1}
					/>
				</label>
				<label>
					size y
					<input
						type="number"
						value={sizeY}
						onChange={e => {
							const newValue = +e.target.value
							setSizeY(newValue)
							sizeYRef.current = newValue
						}}
						min={1}
					/>
				</label>
				<label>
					min angle
					<input
						type="number"
						value={angleRange[0]}
						onChange={e => {
							const newValue = +e.target.value
							setAngleRange(oldRange => [newValue, oldRange[1]])
						}}
						min={0}
					/>
				</label>
				<label>
					max angle
					<input
						type="number"
						value={angleRange[1]}
						onChange={e => {
							const newValue = +e.target.value
							setAngleRange(oldRange => [oldRange[0], newValue])
						}}
					/>
				</label>
				<label>
					t:
					<input type="range" />
				</label>
			</Sidebar>
			<div className="graphs">
				<Graph vertical x={fX} />
				<Graph vertical x={fY} />
				<div className="squares">
					<Graph
						square
						x={[spiralX, fX, (...args) => -spiralX(...args)]}
						y={[spiralY, fY, (...args) => -spiralY(...args)]}
						range={[angleRange]}
						detail={detail}
						rerender={[sizeX, sizeY]}
						scale={15}
					/>
					<Graph
						square
						x={spiralX}
						y={spiralY}
						range={[angleRange]}
						detail={detail}
						rerender={[sizeX, sizeY]}
					/>
					<Graph
						square
						x={[spiralX, fX]}
						y={[spiralY, fY]}
						range={[angleRange]}
						detail={detail}
						rerender={[sizeX, sizeY]}
					/>
					<Graph
						square
						x={[
							spiralX,
							(angle, x, y) =>
								(Math.cos(0.2 + y / sizeXRef.current) *
									sizeXRef.current *
									4 +
									Math.pow(
										Math.sin(x / sizeXRef.current),
										2
									) *
										sizeXRef.current *
										3) /
								6,
						]}
						y={[
							spiralY,
							(angle, x, y) =>
								-Math.pow(
									Math.cos(0.2 + y / sizeXRef.current) / 2 +
										Math.sin(x / sizeXRef.current) / 2,
									2
								) *
								sizeXRef.current *
								1.2,
						]}
						range={[angleRange]}
						detail={detail}
						rerender={[sizeX, sizeY]}
					/>
				</div>
			</div>
		</div>
	)
}

export default App
