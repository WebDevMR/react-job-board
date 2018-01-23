import * as React from 'react';
import { EmployerJobView } from "../../../../types/index";

// styles
import './JobPostUpdatesComponent.scss';

interface IProps {
  jobs: EmployerJobView[];
}

class JobPostUpdatesComponent extends React.Component<IProps, {}> {

  constructor(props) {
    super(props);

    this.createList = this.createList.bind(this);
  }

  createList() {
    if (this.props.jobs === null || this.props.jobs === undefined || this.props.jobs.length <= 0) {
      return this.createEmptyMessageComponent();
    }

    const jobList = this.props.jobs.map((job, index) => {
      return (
        <li key={job.id ? job.id : index} className="job-update-item">
          <h3 className="job-title">{job.title}</h3> {job.location.city}, {job.location.state}
          <div>
            {job.Applicants.length} applicants
          </div>
        </li>
      );
    });

    return (<ul className={'job-post-update-list'}>{jobList}</ul>);
  }

  createEmptyMessageComponent() {
    return (
      <div>
        Once you have jobs you will see them posted here.
      </div>
    );
  }

  render() {
    return (
      <div className={'job-post-updates-container'}>
        <h1>Job Post Updates</h1>
        <div className={'job-post-updates'}>
          {this.createList()}
        </div>
      </div>
    );
  }
}

export default JobPostUpdatesComponent;
