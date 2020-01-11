import React, { useState } from 'react'

import './Sidebar.css'

export default ({ children }) => {
	const [hidden, setHidden] = useState(false)

	return (
		<div className={`sidebar${hidden ? ' hidden' : ''}`}>
			<span className="close" onClick={() => setHidden(!hidden)}>
				✖
			</span>
			<div className="contents">{children}</div>
		</div>
	)
}
