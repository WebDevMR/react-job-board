import * as React from 'react';
import {CurrentJobPost, Employer, Job} from "../../types/index";
import JobPostInfoComponent from "./jobPostInfoComponent";
import JobPostEmployerInfoComponent from "./jobPostEmployerInfoComponent";
import SpinnerComponent from "../spinners/spinnerComponent";
import {RouteComponentProps} from "react-router";

interface jobPostProps extends RouteComponentProps<any> {
	// job: Job
	employer: Employer,
	getJobById: (arg) => {},
	loadJob: () => {},
	resetCurrentJob: () => {},
	currentJobPost: CurrentJobPost
}

interface MyState {
	jobPostEmployerInfo: {
		employerName: string,
		employerLogo: string,
		employerId: string,
	}
}


class JobPostLayout extends React.Component<jobPostProps, MyState> {
	constructor(props) {
		super(props);

		this.state = {
			jobPostEmployerInfo: {
				employerLogo: '',
				employerId: '',
				employerName: ''
			}
		};

		this.loadNewJob = this.loadNewJob.bind(this);
	}

	componentDidMount() {
		this.props.getJobById(this.props.match.params.jobId);
	}

	componentWillUnmount() {
		this.props.resetCurrentJob();
	}

	loadNewJob(jobId) {
		this.props.resetCurrentJob();
		this.props.getJobById(jobId);
	}

	render() {
		console.log('EMPLOYERINFO:', this.props.currentJobPost);

		let employerInfo: any = {
			employerLogo: this.props.currentJobPost.employerLogo,
			employerId: this.props.currentJobPost.employerId,
			employerName: this.props.currentJobPost.employerName
		};

		if (this.props.currentJobPost.isFetching === undefined || this.props.currentJobPost.isFetching === true) {
			console.log('DISPLAYING THE SPINNER');
			return <SpinnerComponent/>
		} else {
			console.log("DISPLAYING THE JOB POST INFO");
			return (
				<div>
					<JobPostInfoComponent job={this.props.currentJobPost} isFetching={this.props.currentJobPost.isFetching}/>
					<JobPostEmployerInfoComponent employer={this.props.currentJobPost} loadJob={this.loadNewJob}/>
				</div>
			)
		}
	}
}

export default JobPostLayout;