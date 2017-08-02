export const decorateTerm = (Term, {React}) => class extends React.Component {
	render() {
		const {customChildren} = this.props;
		return <Term {...this.props} customChildren={
			[]
				.concat(customChildren)
				.concat(
					<h1>it works!</h1>
				)
			}
		/>;
	}
};
