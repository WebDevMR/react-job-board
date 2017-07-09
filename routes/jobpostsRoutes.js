/**
 * Created by Rico on 12/4/2016.
 */
const express = require('express');
const router = express.Router();
const Employer = require('../models/employer');
const User = require('../models/user');
const Jobs = require('../models/jobs');
const Applicants = require('../models/applicants');

// =============================
router.param('jobId', function (req, res, next, jobId) {
    Jobs.findById(req.params.jobId, function (err, doc) {
        if (err) {
            res.status(404).json({
                title: 'An error occurred finding first job',
                error: err
            })
        }

        if (!doc) {
            res.status(404).json({
                title: 'No user found',
                error: {message: 'User could not be found'}
            })
        }

        if (doc) {
            //we found a job, now we need to add the employer to it.
            //this will make it easier when we need to display job
            // and employer info in the job post pages


            Employer.findById(doc.employerId, function (err, employer) {
                if (err) {
                    res.status(404).json({
                        title: "Could not find an employer.",
                        error: err,
                    })
                }

                if (!employer) {
                    res.status(404).json({
                        title: "No employer found",
                        error: {message: "No employer could be found"}
                    })
                }

            }).populate({
                    path: "jobs",
                    options: {sort: {createdAt: -1}}
                })
                .exec(function (error, employer) {
                    if (err) return handleError(err);

                    req.employerModel = employer;
                    req.job = doc;
                    next();
                })

        } //if doc
    });
});


// =============================
router.get('/:jobId', function (req, res, next) {
    res.status(200).json({
        message: 'Success',
        job: req.job,
        employer: req.employerModel
    });
});

// =============================
router.get('/', function (req, res) {

    /*sorted by date created for the home page.*/
    Jobs.find({})
        .sort('-createdAt')
        .exec(function(err, jobs){
            res.send(jobs);
        });

});
// =============================
router.patch('/:jobId', function (req, res, next) {


    //where we are going to store the user retrieved from the db
    let userApplying;
    // var alreadyApplied = false;
    let userID = '';
    let employer;

    //if the user has an account/_id in the database already
    if (req.body.applicantInfo.userID) {

        User.findById(req.body.applicantInfo.userID, function (err, applicant) {
            if (err) {
                res.status(404).json({
                    title: 'An error occurred User Error',
                    error: err
                })
            }

            if (!applicant) {
                res.status(404).json({
                    title: 'No user found',
                    error: {message: 'User could not be found'}
                })
            }

            //a registered user exists in the DB
            if (applicant) {

                userID = applicant._id;
                //if this jobID is not in the registered users jobsApplied array
                //then it means they have not applied to this job
                if (applicant.jobsApplied.indexOf(req.body.jobID) == -1) {
                    userApplying = applicant;
                }
            }
        });
    }

    Jobs.findById(req.body.jobID, function (err, job) {
        if (err) {
            res.status(404).json({
                title: 'An error occurred No JobID',
                error: err
            })
        }

        if (!job) {
            res.status(404).json({
                title: 'No user found',
                error: {message: 'User could not be found'}
            })
        }

        /*
         if we have a job add user to the applicants array
         and add the job to the users appliedJobs array
         */

        /*The job needs to check to see if the applicant's email already exists in the applicants array.
         * if it does, don't add the applicant again.*/

        if (job) {

            Employer.findById(job.employer, function (err, employerDOC) {
                if (err) {
                    return res.status(404).json({
                        title: 'An Error Occured on Employer Find',
                        error: err
                    });
                }

                if (employerDOC) {
                    employer = employerDOC
                }
            });

            let newApplicant = new Applicants({
                userID: userID,
                firstName: req.body.applicantInfo.firstName,
                lastName: req.body.applicantInfo.lastName,
                cellPhone: req.body.applicantInfo.cellPhone,
                homePhone: req.body.applicantInfo.homePhone,
                email: req.body.applicantInfo.email,
                resume: req.body.applicantInfo.resume,
                coverLetter: req.body.applicantInfo.resume,
                location: {
                    address: req.body.applicantInfo.location.address,
                    city: req.body.applicantInfo.location.city,
                    state: req.body.applicantInfo.location.state,
                    zipCode: req.body.applicantInfo.location.zipCode
                },
                employerID: job.employer,
                jobID: req.body.applicantInfo.jobID,
            });


            newApplicant.save(function (err, applicant) {
                if (err) {
                    return res.status(404).json({
                        title: 'An Error ocurred ON APPLICANT SAVE',
                        error: err
                    });
                }

                job.applicants.push(applicant);

                employer.applicants.push(applicant);

                employer.save(function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                    }
                );

                job.save(function (err, result) {
                    if (err) {
                        return res.status(404).json({
                            title: 'An Error ocurred no job save',
                            error: err
                        });
                    }

                    //if we have a registered user
                    if (userApplying) {
                        userApplying.jobsApplied.push(job);

                        userApplying.save(function (err, result) {
                            if (err) {
                                return res.status(404).json({
                                    title: 'An Error ocurred userapplying prob here',
                                    error: err
                                });
                            }
                        });
                    }

                    return res.status(201).json({
                        message: 'Saved job',
                        obj: result
                    });
                }); //job.save
            });
            /*If we found a user in the database from earlier function*/
        }
    })

});

module.exports = router;