import * as React from 'react';
import {connect} from 'react-redux';
import {getJobs} from '../../../actions/jobActions';

//style
import './joblistContainer.scss';

//component
import JobListComponent from './jobListComponent';

//interfaces
import { StoreState} from "../../../types/index";

function mapPropsToState(store: StoreState) {
	return {jobs: store.jobs};
}

const mapDispatchToProps = (dispatch) =>({
	getJobs: () => dispatch(getJobs())
});

export default connect(mapPropsToState, mapDispatchToProps)(JobListComponent);