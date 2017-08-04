import React from 'react';
import tildePath from 'tilde-path';
import {FileDirectoryIcon, HomeIcon} from 'react-octicons-svg';

export const decorateConfig = config => Object.assign(config, {
	css: `
		${config.css || ''}

		.term_term {
			padding-bottom: 36px;
		}

		.status_status {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			height: 36px;
			background: rgba(255,255,255,0.05);
			padding: 6px 14px;
			font-size: 12px;
			line-height: 24px;
		}

		.status_item .octicons {
			vertical-align: text-bottom;
			margin-right: .6em;
		}

		.octicons {
			fill: currentColor;
		}
	`
});

const Status = ({session}) => {
	const shortPath = session.cwd && tildePath(session.cwd);
	return <footer className='status_status'>
		<div className='status_item status_left'>
			{ shortPath === '~'
				? <HomeIcon />
				: <FileDirectoryIcon />}
			{shortPath}
		</div>
	</footer>
};

export const decorateTerm = (Term, {React}) => class extends React.Component {
	render() {
		const {customChildren, session} = this.props;

		return <Term {...this.props} customChildren={
			[]
				.concat(customChildren)
				.concat(
					<Status session={session} />
				)
			}
		/>;
	}
};

export const getTermProps = (uid, parentProps, props) => Object.assign(props, {
	session: parentProps.sessions[uid]
});
