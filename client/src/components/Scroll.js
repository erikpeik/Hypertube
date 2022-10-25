//scroll.jsx

import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Browsing from "./Browsing";

const style = {
	height: 30,
	border: "3px solid pink",
	margin: 6,
	padding: 8,
};

class Scroll extends React.Component {
	state = {
		items: Array.from({ length: 5 }),
	};

	fetchMoreData = () => {
		setTimeout(() => {
			this.setState({
				items: this.state.items.concat(Array.from({ length: 5 })),
			});
		}, 1500);
	};

	render() {
		return (
			<div>
				<InfiniteScroll
					dataLength={this.state.items.length}
					next={this.fetchMoreData}
					hasMore={true}
					loader={<h4>Loading...</h4>}
				>
					{this.state.items.map((i, index) => (
						<div style={style} key={index}>
							div - {index}
						</div>
					))}
				</InfiniteScroll>
			</div>
		);
	}
}

export default Scroll;
