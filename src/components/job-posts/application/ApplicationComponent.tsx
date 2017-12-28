import * as React from 'react';

import ModalComponent from '../../modal/ModalComponent';
import SimpleForm from '../../simple-form/SimpleForm';
import Fade from '../../animations/Fade';

interface MyProps {
  jobId: string | null;
  jobTitle: string;
  employerId: string | null;
  handleApplicantInfo: (applicantInfo) => {};
  cancelApplication: () => void;
  viewingApplication: boolean;
}

const modalParent = document.getElementById('modal-root');

class ApplicationComponent extends React.Component<MyProps> {
  private locationInputs = [
    {
      label: 'First Name',
      required: true,
      type: 'text',
      placeHolder: 'First Name',
      id: 'fName',
    },
    {
      label: 'Last Name',
      required: true,
      type: 'text',
      placeHolder: 'Last Name',
      id: 'lName',
    },
    {
      label: 'email',
      required: true,
      type: 'text',
      placeHolder: 'email',
      id: 'email',
    },
    {
      label: 'Phone Number',
      required: true,
      type: 'tel',
      placeHolder: '555-555-555',
      id: 'phoneNumber',
    },
    {
      label: 'website',
      required: false,
      type: 'text',
      placeHolder: 'www.yourwebsite.com',
      id: 'website',
    },
    {
      label: 'Resume',
      required: true,
      type: 'file',
      name: 'resume',
      accept: '.pdf',
      placeHolder: 'upload your resume',
      id: 'resume',
    },
    {
      label: 'Cover Letter',
      required: false,
      type: 'file',
      accept: '.pdf',
      placeHolder: 'upload your resume',
      id: 'coverLetter',
    },
  ];

  constructor(props) {
    super(props);

    this.handleApplicationSubmit = this.handleApplicationSubmit.bind(this);
  }

  handleApplicationSubmit(data) {
    console.log('data from job application...', data);
    /*We only get the info from the form here. We need to add the employer and jobId info to this.*/
    const updatedData = {
      ...data,
      employerId: this.props.employerId,
      jobId: this.props.jobId,
    };
    this.props.handleApplicantInfo(updatedData);
  }

  render() {
    if (this.props.viewingApplication === false) {
      return null;
    }
    const cancelButton = { click: this.props.cancelApplication, btnText: 'Cancel' };
    return (
      <ModalComponent>
        <div className="modal">
          <Fade key="application-form-comp" in={this.props.viewingApplication}>
            <SimpleForm
              header={`Apply to ${this.props.jobTitle}`}
              inputs={this.locationInputs}
              submitBtnText={'Submit Application'}
              verifyInputs={null}
              onSubmitCB={this.handleApplicationSubmit}
              joined={true}
              style={{ width: 'auto' }}
              cancelButton={cancelButton}
            />
          </Fade>
        </div>
      </ModalComponent>
    );
  }
}

export default ApplicationComponent;
