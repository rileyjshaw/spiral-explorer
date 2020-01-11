import React, { useState, useRef, useLayoutEffect } from 'react'
import './Graph.css'
import { useEffect } from 'react'

function valueOf(fns = [], i) {
	return fns.reduce(
		(acc, [fX, fY]) => {
			const [x, y] = acc
			acc[0] += fX(i, x, y)
			acc[1] += fY(i, x, y)
			return acc
		},
		[0, 0]
	)
}

export default ({
	vertical,
	square,
	x = [],
	y = [],
	range = [[0, 10]],
	detail = 1,
	rerender = [],
	scale = 1,
}) => {
	const ref = useRef()
	const [[width, height], setDimensions] = useState([])
	if (typeof x === 'function') x = [x]
	if (typeof y === 'function') y = [y]

	useLayoutEffect(() => {
		const { width, height } = ref.current.getBoundingClientRect()
		setDimensions([width * 2, height * 2])
	}, [])

	useEffect(() => {
		if (!ref.current) return
		if (vertical) return
		if (!x.length || !y.length) return

		const ctx = ref.current.getContext('2d')
		ctx.save()
		ctx.clearRect(0, 0, width, height)
		ctx.translate(width / 2, height / 2)
		ctx.strokeStyle = '#a68933'

		// TODO: Make range able to handle more than 1 arg.
		const args = Array.from(
			{ length: (range[0][1] - range[0][0]) * detail },
			(_, i) => range[0][0] + i / detail
		)
		const fns = x.map((fX, i) =>
			[fX, y[i]].map(fn => (...inp) => fn(...inp) * scale)
		)

		ctx.beginPath()
		ctx.moveTo(...valueOf(fns, args[0]))
		args.slice(1).forEach(val => ctx.lineTo(...valueOf(fns, val)))

		ctx.stroke()
		ctx.restore()
	}, [width, height, x, y, detail, ...range[0], ...rerender])

	return (
		<canvas
			ref={ref}
			width={width}
			height={height}
			className={`graph${vertical ? ' vertical' : ''}${
				square ? ' square' : ''
			}`}
		></canvas>
	)
}
