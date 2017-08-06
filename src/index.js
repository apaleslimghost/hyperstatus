import React from 'react';
import tildePath from 'tilde-path';
import {
	FileDirectoryIcon,
	HomeIcon,
	GitBranchIcon,
	DiffAddedIcon,
	DiffModifiedIcon,
	DiffIgnoredIcon,
} from 'react-octicons-svg';
import {isGit as _isGit, check as _check} from 'git-state';
import promisify from '@quarterto/promisify';
import findUp from 'find-up';
import path from 'path';

const check = promisify(_check);
const isGit = promisify((...args) => {
	const cb = args.pop();
	console.log(args);
	return _isGit(...args, is => cb(null, is));
});

const guard = cond => Promise[cond ? 'resolve' : 'reject']();

export const decorateConfig = config => Object.assign(config, {
	css: `
		${config.css || ''}

		.term_term {
			position: absolute;
			top: 0;
			bottom: 36px;
			height: auto;
		}

		.status_status {
			display: flex;
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

		.status_group {
			display: flex;
		}

		.status_left {
			margin-right: auto;
		}

		.status_right {
			margin-left: auto;
		}

		.status_left .status_item {
			margin-right: 1em;
		}

		.status_right .status_item {
			margin-left: 1em;
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

const FolderItem = ({session}) => {
	const shortPath = session.cwd && tildePath(session.cwd);
	return <div className='status_item'>
		{ shortPath === '~'
			? <HomeIcon />
			: <FileDirectoryIcon />}
		{shortPath}
	</div>;
};


const GitItem = ({session}) => session.git
	? <div className='status_group'>
		<div className='status_item'>
			<GitBranchIcon />
			{session.git.branch}
		</div>

		{session.git.dirty
			? <div className='status_item'>
				<DiffModifiedIcon />
				{session.git.dirty}
			</div>
			: null}

		{session.git.untracked
			? <div className='status_item'>
				<DiffIgnoredIcon />
				{session.git.untracked}
			</div>
			: null}
	</div>
	: null;

const Status = ({session}) => <footer className='status_status'>
	<div className='status_group status_left'>
		<FolderItem session={session} />
	</div>
	<div className='status_group status_right'>
		<GitItem session={session} />
	</div>
</footer>;

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

export const middleware = store => next => action => {
	switch(action.type) {
		case 'SESSION_SET_CWD':
			store.dispatch(dispatch => {
				findUp('.git', {cwd: action.cwd})
					.then(path.dirname)
					.then(gitDir =>
						isGit(gitDir)
							.then(guard)
							.then(() => check(gitDir))
					)
					.then(gitState =>
						dispatch({
							type: 'SESSION_SET_GIT',
							gitState,
						})
					)
					.catch(console.error);
			});
			next(action);
		default:
			next(action);
	}
};

export const reduceSessions = (state, action) => {
	switch(action.type) {
		case 'SESSION_SET_GIT':
			return state.setIn(['sessions', state.activeUid, 'git'], action.gitState);
		default:
			return state;
	}
};
