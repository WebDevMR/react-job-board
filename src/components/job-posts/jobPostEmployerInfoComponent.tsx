import * as React from 'react';

import {Link} from 'react-router-dom'


import {Employer} from "../../types/index";
import {IMG_URL, LOCAL_URL} from "../../utils/utils";

/**
 * Styles
 */
import "./styles/jobPostEmployerInfo.scss";

interface MyProps {
	employer,
	loadJob: (arg: any) => (any)
}

class JobPostEmployerInfoComponent extends React.Component<MyProps, any> {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	createJobList() {
		/*Need to create a ul with links of the other jobs offered by this employer.
		* They need to navigate to /jobposts/:jobId.
		* They should not include the job you're currently on.
		* Need to figure out if we need another component for this section or not*/
		let employer = this.props.employer;

		return employer.jobs.map(job =>
			<Link to={`/jobposts/${job._id}`} key={`${job.jobTitle}${new Date()}${job._id}`} onClick={() => {
				this.handleClick(job._id)
			}}>
				<li>{job.jobTitle}</li>
			</Link>
		)
	}

	createSocialMediaLinks() {
		console.log("the social media links fo this accounta re..", this.props.employer.socialMedia);
		return (
			<ul className="social-lists">
				<li>
					<a href={`https://www.facebook.com/`} target="blank">
						<img src={`${LOCAL_URL}${require('../../assets/images/icon-facebook.svg')}`}/>
					</a>
				</li>
				<li>
					<a href={`https://www.twitter.com/`} target="blank">
						<img src={`${LOCAL_URL}${require('../../assets/images/icon-twitter.svg')}`}/>
					</a>
				</li>
				<li>
					<a href={`https://www.linkedin.com/`} target="blank">
						<img src={`${LOCAL_URL}${require('../../assets/images/icon-linkedin.svg')}`}/>
					</a>
				</li>
			</ul>
		)
	}

	handleClick(jobId) {
		this.props.loadJob(jobId);
	}


	render() {

		if (this.props.employer.name === null) {
			return null;
		}

		let employer: Employer = this.props.employer;
		let logo = employer.logoImg.length > 0 ? `${IMG_URL}${employer.logoImg}` : `${LOCAL_URL}${require('../../assets/images/no-icon.svg')}`;
		console.log('the logoimg', employer.logoImg);
		console.log('the logo', logo);
		return (
			<aside className="jp-employer-aside">
				<img className="company-logo" src={logo} alt={`${employer.name} Logo`}/>
				<h1 className="title">About {employer.name}</h1>
				<p className="jp-employer-location">{`${employer.location.city},${employer.location.state}`}</p>
				{this.createSocialMediaLinks()}
				<div>
					<h1 className="title">Other jobs by {employer.name}</h1>
					<ul className="other-job-ul">
						{this.createJobList()}
					</ul>
				</div>
			</aside>
		)
	}
}

export default JobPostEmployerInfoComponent;