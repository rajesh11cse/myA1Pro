import React from 'react';
import Nav from '../nav/nav';
import Footer from '../footer/footer';
import DocumentTitle from "react-document-title";
import { browserHistory } from 'react-router';
import {STRINGS,REGEX,DB_MAP_UI} from '../_utility/constants';
import {Link} from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Phone, {phoneNumberFormat, isValidPhoneNumber} from 'react-phone-number-input';
import classNames from "classnames";

class ProfileQuestionnaire extends React.Component {

    constructor(props) {
    	super(props);
    	let that = this;
    	var token = sessionStorage.getItem('token')||null;
        var state = {
        	questionnaire : []
        };

        // console.log(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.GET_QUESTIONNAIRE);
        $.ajax({
            url: STRINGS.URL+STRINGS.API_PREFIX+STRINGS.GET_QUESTIONNAIRE,
            type: 'GET',
            cache: false,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            success: function(data) {
                // this.setState({data: data});
                // console.log(STRINGS.GET_QUESTIONNAIRE,data);
                if(data.success && data.data){
                	that.setState({questionnaire:data.data});
                }else{
                }

            }.bind(this),
            error: function(xhr, status, err) {
                // console.error(STRINGS.URL+STRINGS.API_PREFIX+STRINGS.GET_QUESTIONNAIRE, status, err, xhr);
                var password_msg = err.toString();
                if(xhr && xhr.responseJSON && xhr.responseJSON.message){
                    password_msg = xhr.responseJSON.message;
                }
            }.bind(this)
        });

        that.state = state;
    }

    generateQuestionnaire(){
    	let that = this;
    	let question_list = [];
    	let questionnaire_list = that.state.questionnaire;


    	for(let question_index in questionnaire_list){

			let list_of_subAnswerOptions = [];
			let list_of_answerOptions = [];
    		let subquestions_list = questionnaire_list[question_index]["subquestions"]||null; 
    		if(subquestions_list){

	    		let answers_list = subquestions_list["answers"]||null; 
    			if(answers_list && answers_list.length>0){

    				for(let answer_index in answers_list){

    					list_of_subAnswerOptions.push(
    						<div class="send-button1 "> {answers_list[answer_index]["text"]}  </div>
    					);

    				}
    			}

    		}


			let answers_list = questionnaire_list[question_index]["answers"]||null; 
			if(answers_list && answers_list.length>0){

				for(let answer_index in answers_list){

					list_of_answerOptions.push(
						<div class="send-button1 "> {answers_list[answer_index]["text"]}  </div>
					);
					
				}
			}

    		




    		if(subquestions_list){

    			question_list.push(
	    			<div class="box-shadow row  box-shadow-bottom1 text-center">
                        <div class="col-lg-12 ">
                            <div class="col-lg-12 ">{questionnaire_list[question_index]["question"]}</div>
                            <div class="col-lg-12 box-shadow-pad-child">
                                {list_of_answerOptions}
                            </div>         
                        </div>
                        <br/>
                        <div class="col-lg-12 seond-question" text-center>
                            <div class="col-lg-12 ">{questionnaire_list[question_index]["subquestions"]["question"]}</div>
                            <div class="col-lg-12 box-shadow-pad-child">
                            	{list_of_subAnswerOptions}
                            </div>         
                        </div>
                    </div>
                );

    		}else{

    			question_list.push(
	    			<div class="box-shadow row  box-shadow-bottom1 text-center">
                        <div class="col-lg-12 ">
                            <div class="col-lg-12 ">{questionnaire_list[question_index]["question"]}</div>
                            <div class="col-lg-12 box-shadow-pad-child">
                                {list_of_answerOptions}
                            </div>         
                        </div>
                    </div>
                );

    		}

		}

    	return question_list;

    }

    render(){
    	let that = this;
    	return(
    		<div class="col-lg-12">
    			{that.generateQuestionnaire()}
    		</div>
    	);
    }
}
export default ProfileQuestionnaire;