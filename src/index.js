export const decorateTerm = (Term, {React}) => class extends React.Component {
	render() {
		const {customChildren, session} = this.props;

		return <Term {...this.props} customChildren={
			[]
				.concat(customChildren)
				.concat(
					<h1>{session.cwd}</h1>
				)
			}
		/>;
	}
};

export const getTermProps = (uid, parentProps, props) => Object.assign(props, {
	session: parentProps.sessions[uid]
});
