import React from 'react';
import Nav from '../../nav/nav';
import Footer from '../../footer/footer';
import DocumentTitle from "react-document-title";
import {STRINGS} from '../../_utility/constants';
import {Link} from 'react-router';



class Questionnaire extends React.Component {
    
    constructor(props) {
        super(props);
        
        this.goToNext = this.goToNext.bind(this);
        this.goToBack = this.goToBack.bind(this);
        
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleChecklistButton = this.handleChecklistButton.bind(this);
        this.handleRadiolistButton = this.handleRadiolistButton.bind(this);
        
        var state = {
            questions : [],
            questionsObject : {},
            flow : [],
            answers : {},
            currentQuestion : 1,
            currentQuestionID : "",
        };
        this.state = state;
    }
    
    setDataInState() {
        var that = this;      
        var state = [];
        state["questions"] = [
              { 
                  id : "q-001",
                  question : "In what City are you looking to work?",
                  detail : "This service is currently only available in Boston. Please <a href='/#/ContactUs'>Contact Us</a> if you'd like us to come to your city",
                  intro : "Tell us a little bit about yourself so that we can provide you with the best gig matches",
                  type : "dropdown",
                  answers : [
                        { text : "Boston", value : 1 },
                  ]
              },
              { 
                  id : "q-002",
                  question : "Which of the following do you own?",
                  detail : "Please select <i>all</i> vehicles you are able to use for your work",
                  type : "checklist",
                  answers : [
                        { text : "CAR", icon_class : "fa-cars", value : 1},
                        { text : "MOTORCYCLE", icon_class : "fa-motorcycles", value : 2 },
                        { text : "MINIVAN OR SUV", icon_class : "fa-taxis", value : 3 },
                        { text : "TRUCK", icon_class : "fa-trucks", value : 4 },
                        { text : "FULL-SIZED VAN", icon_class : "fa-van", value : 5 },
                        { text : "BIKE", icon_class : "fa-bike", value : 6 },
                        { text : "SCOOTER", icon_class : "fa-scooter", value : 7 },
                        { text : "NONE OF THESE", icon_class : "fa-none", value : -1 },
                  ],
                  scope : ["transportation"]
              },
              { 
                  id : "q-003",
                  question : "What type of mobile device do you have?",
                  //detail : "Please select one device",
                  type : "radiolist",
                  answers : [
                        { text : "ANDROID", icon_class : "fa-androids", value : 1 },
                        { text : "IOS", icon_class : "fa-apples", value : 2 },
                  ]
              },
              { 
                  id : "q-004",
                  question : "Would you be comfortable dealing directly with restaurants and customers?",
                  //detail : "Please select one option",
                  type : "radiolist",
                  answers : [
                        { text : "YES", value : 1 },
                        { text : "NO", value : 0 },
                  ],
                  scope : ["customerservice"]
              },
              { 
                  id : "q-005",
                  question : "Are you a house cleaner?",
                  //detail : "Please select one option",
                  type : "radiolist",
                  answers : [
                        { text : "YES", value : 1 },
                        { text : "NO", value : 0 },
                  ],
                  scope : ["cleaning"]
              },
              { 
                  id : "q-006",
                  question : "Are you a handyman?",
                  //detail : "Please select one option",
                  type : "radiolist",
                  answers : [
                        { text : "YES", value : 1 },
                        { text : "NO", value : 0 },
                  ],
                  scope : ["repair"],
                  related : ["q-006-01"],
                  conditional : true,
                  subquestions : [
                      { 
                          id : "q-006-01",
                          pid : "q-006",
                          question : "What skills do you have?",
                          detail : "Please select all that apply",
                          type : "checklist",
                          answers : [
                                { text : "Carpentry", value : 1, icon_class : "carpentry" },
                                { text : "Electrical", value : 2, icon_class : "electrical" },
                                { text : "Plumbing", value : 3, icon_class : "plumbing" },
                                { text : "Moving", value : 4, icon_class : "moving" },
                                { text : "Painting", value : 5, icon_class : "painting" },
                          ],
                          conditioned : true,
                      },
                  ]
              },
              { 
                  id : "q-007",
                  question : "Do you love dogs?",
                  //detail : "Please select one option",
                  type : "radiolist",
                  answers : [
                        { text : "YES", value : 1 },
                        { text : "NO", value : 0 },
                  ],
                  scope : ["pets"],
                  related : ["q-007-01","q-007-02","q-007-03"],
                  conditional : true,
                  subquestions : [
/*                      { 
                          id : "q-007-01",
                          pid : "q-007",
                          question : "Do you like spending time outdoors?",
                          detail : "Please select one option",
                          type : "radiolist",
                          answers : [
                                { text : "YES", value : 1 },
                                { text : "NO", value : 0 },
                          ]
                      },*/
                      { 
                          id : "q-007-02",
                          pid : "q-007",
                          question : "Have you ever worked as a professional dog walker?",
                         // detail : "Please select one option",
                          type : "radiolist",
                          answers : [
                                { text : "YES", value : 1 },
                                { text : "NO", value : 0 },
                          ],
                          conditioned : true,
                      },
/*                      { 
                          id : "q-007-03",
                          pid : "q-007",
                          question : "Have you ever owned a dog?",
                          detail : "Please select one option",
                          type : "radiolist",
                          answers : [
                                { text : "YES", value : 1 },
                                { text : "NO", value : 0 },
                          ]
                      },*/
                  ]
              },
              
        ];
        
        //state["flow"] = ["q-001","q-002","q-003","q-004","q-005",["q-006","q-006-01"],["q-007","q-007-01","q-007-02","q-007-03"]]
        state["flow"] = ["q-001","q-002","q-003","q-004","q-005",["q-006","q-006-01"],["q-007","q-007-02"]]
        
        state["currentQuestionID"] = state["questions"][0]["id"];
        
        state["answers"] = {}
        state["answers"]["q-001"] = "1";
        
        that.setState(state);

    }
    
    componentDidMount(){
        this.setDataInState();
        $('.questionGroup:not(:first)').hide();
    }
    
    componentDidUpdate(){
       let that = this; 
       let ans = that.state.answers;
       //console.log(ans)
       try {
            var serializedState = JSON.stringify(ans);
            //console.log(JSON.stringify(ans));
            sessionStorage.setItem('answers', serializedState);
          } catch (err) {
            // Ignore write errors.
          }
    }

    goToBack(e){
        let that = this;
        var obj = e.target;
        //var id = $(obj).attr("data-qid");
        var id = that.state.currentQuestionID;
        this.setState({
            currentQuestion: that.state.currentQuestion -= 1,
            currentQuestionID: that.state["questions"][(that.state.currentQuestion-1)]["id"] ,
        },function(){
            //console.log(that.state.currentQuestionID)
        })
        window.scrollTo(0, 0);
    }
    
    goToNext(e){
        let that = this;
        var obj = e.target;
        //var id = $(obj).attr("data-qid");
        var id = that.state.currentQuestionID;
        if( that.state.answers[id] ){
            this.setState({
                currentQuestion: that.state.currentQuestion += 1,
                currentQuestionID: that.state["questions"][(that.state.currentQuestion-1)]["id"] ,
            },function(){
                //console.log(that.state.currentQuestionID)
            })
            window.scrollTo(0, 0);
        }else{
            console.log("answer the question");
        }
    }
    
    checkFlow(index,conditional){
        let that = this;
        let flow = that.state.flow;
        let step = flow[index];
        let answers = that.state.answers;
        if ( Array.isArray( step ) ){
            let count = 0 ;
            for ( let i=0 ; i < step.length ; i++ ){
                let curr = ""+step[i];
                if ( i == 0 && ( answers[curr] && conditional ) && answers[curr] != conditional ){
                    return true;
                }
                if ( answers[curr] ){
                    count++;
                }
            }
            if ( count == step.length ){
                return true;
            }else{
                return false;
            } 
        }else{
            if ( answers[step] ){
                return true;
            }else{
                return false;
            }
        }
        
    }
    
    handleSelectChange(e){
        let that = this;
        var obj = e.target;
        var id = $(obj).attr("data-qid");
        var pid = $(obj).attr("data-pid");
        var value = obj.value;
        var answers = that.state.answers;
        if ( value!="-1" ){
            answers[id]=value;
        }else{
            delete answers[id];
        }
        this.setState({
            answers : answers
        })
        //console.log(this.state.answers)
    } 
    
    handleChecklistButton(e){
        let that = this;
        var obj = e.target;
        if ( $(obj).hasClass("icon") ){
            obj = $(obj).parent();
        }
        var id = $(obj).attr("data-qid");
        var pid = $(obj).attr("data-pid");
        var value = $(obj).val();
        var answers = that.state.answers;
        if ( answers[id] == -1 ){
            delete answers[id];
            this.setState({
                answers : answers
            })
        }
        if (!answers[id]){
            answers[id] = new Array();
        }
        var found = jQuery.inArray(value, answers[id]);
        if( found == -1 ) {
            if (value=="-1"){
                answers[id] = -1;
            }else{
                answers[id].push(value);
            }
        }else{
            answers[id].splice(found, 1);
            if( answers[id].length == 0 ){
               delete answers[id];
            }
        }
        this.setState({
            answers : answers
        })
        //console.log(this.state.answers)
    }    
    
    handleRadiolistButton(e){
        let that = this;
        var obj = e.target;
        var answers = that.state.answers;
        if ( $(obj).hasClass("icon") ){
            obj = $(obj).parent();
        }
        var id = $(obj).attr("data-qid");
        var pid = $(obj).attr("data-pid");
        var value = $(obj).val();
        if ( !answers[id] || ( answers[id] && answers[id] != value ) ){
            answers[id]=value;
            $("#"+id).find(".questionGroup").each(function(){
                let id = $(this).attr("id");
                if( !pid && answers[id] ){
                    delete answers[id];
                }
            })
        }else {
            delete answers[id];
        }
        this.setState({
            answers : answers
        })
        //console.log(this.state.answers)
    }
    
    generateQuestions(questions){
        let that = this;
        var currentQuestion = that.state.currentQuestion;
        return (
            questions.map(function(question,index){
              index+=1;
              return( 
                <section id={question.id} key={index} 
                         className="questionGroup text-center col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1" 
                         style={{display:""+(index==currentQuestion?"block":"none")}}>
                      <div className="row">
                         {((index-1)>=1) &&
                            <img className="prev_arrow hidden-xs" onClick={that.goToBack} src="public/img/icons/left_arrow.png"></img>
                         }
                         { question.intro && 
                             <h2 dangerouslySetInnerHTML={{__html: question.intro}}></h2>
                         }
                         <h3 dangerouslySetInnerHTML={{__html: question.question}}></h3>
                         {question.detail && <p className="margin-bottom-30"  dangerouslySetInnerHTML={{__html: question.detail}}></p>}
                         <div>
                              { that.generateAnwsersContainer(question.id,question.type,question.answers)}
                              {(function(question){
                                  if( question.subquestions ){
                                      return ( that.generateSubQuestions(question.subquestions) );
                                  }
                              })(question)}
                         </div>
                      </div>

                      {(function(index,questions){
                          if( index < questions.length ){
                              if ( index == 1 ){ // First Item
                                  if ( that.checkFlow((index-1),question.conditional) ){
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_next_button"} data-id={(index)} data-qid={question.id} type="button" className={"btn gig_button background backgroundHover color_1"} onClick={that.goToNext}>NEXT</button>
                                          </div>
                                      )
                                  }else{
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_next_button"} data-id={(index)} data-qid={question.id} type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>NEXT</button>
                                          </div>
                                      )
                                  }
                             }else{
                                 if ( that.checkFlow((index-1),question.conditional) ){
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_perv_button"} data-id={(index)} data-qid={question.id} type="button" className="btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm" onClick={that.goToBack}>PREVIOUS</button>
                                              <button id={question.id+"_next_button"} data-id={(index)} data-qid={question.id} type="button" className={"btn gig_button background backgroundHover color_1"} onClick={that.goToNext}>NEXT</button>
                                          </div>
                                      )
                                  }else{
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_perv_button"} data-id={(index)} data-qid={question.id} type="button" className="btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm" onClick={that.goToBack}>PREVIOUS</button>
                                              <button id={question.id+"_next_button"} data-id={(index)} data-qid={question.id} type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>NEXT</button>
                                          </div>
                                      )
                                  }
                             }
                          }else{
                                 if ( that.checkFlow((index-1),question.conditional) ){
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_perv_button"} data-id={(index)} data-qid={question.id} type="button" className="btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm" onClick={that.goToBack}>PREVIOUS</button>
                                              <Link className={"btn gig_button background backgroundHover color_1"} to="/Match">SUBMIT</Link>
                                          </div>
                                      )
                                  }else{
                                      return(
                                          <div className="row question_nav">
                                              <button id={question.id+"_perv_button"} data-id={(index)} data-qid={question.id} type="button" className="btn gig_button background backgroundHover color_2 hidden-lg hidden-md hidden-sm" onClick={that.goToBack}>PREVIOUS</button>
                                              <button id={question.id+"_next_button"} data-id={(index)} data-qid={question.id} type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>SUBMIT</button>
                                          </div>
                                      )
                                  }
                          }
                      })(index,questions)}
                      
                 </section>
              );
            })
        )
    } 
    
    generateSubQuestions(questions){
        let that = this;
        var currentQuestion = that.state.currentQuestion;
        return (
            questions.map(function(question,index){
              index+=1;   
              return(
                <section id={question.id} key={index} className="questionGroup subQuestion text-center col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1" style={{display:""+((!question.conditioned||(that.state.answers[question.pid]&&that.state.answers[question.pid]==question.conditioned))?"block":"none")}}>
                     <div className="row">
                         {((index-1)>=1) &&
                            <img className="prev_arrow hidden-xs" onClick={that.goToBack} src="public/img/icons/left_arrow.png"></img>
                         }
                         { question.intro && 
                             <h2 dangerouslySetInnerHTML={{__html: question.intro}}></h2>
                         }
                         <h3 className="margin-bottom-15" dangerouslySetInnerHTML={{__html: question.question}}></h3>
                         {question.detail && <p className="margin-bottom-30"  dangerouslySetInnerHTML={{__html: question.detail}}></p>}
                         <div>
                             { that.generateAnwsersContainer(question.id,question.type,question.answers,question.pid) }
                         </div>
                      </div>

                 </section>
              );
            })
        )
    }
    
    generateAnwsersContainer(id,type,answers,pid){
        let that = this;
        switch(type) {
            case "dropdown":
                return (
                    <select className="btn ans_button backgroundHover color_1 select_button" data-qid={id} onChange={that.handleSelectChange}  data-pid={pid?pid:""} defaultValue={(that.state.answers[id]?that.state.answers[id]:"-1")}>
                        <option value="-1" >&nbsp;&nbsp;Select a City&nbsp;&nbsp;</option>
                        {that.generateAnswers(id,type,answers,pid)}
                    </select>
                )
            break;
            case "radiolist":
            case "checklist":
            case "default":
                return (
                    <div className="questionnaire_answer_container margin-bottom-15">
                        {that.generateAnswers(id,type,answers,pid)}
                    </div>
                )
            break; 
        }
    }
    
    generateAnswers(id,type,answers,pid){
        let that = this;
        var structure = answers.map(function(answer,aIndex){
        var icon ;
        if (answer.icon_class){
            icon = (<div class={"icon "+answer.icon_class} aria-hidden="true" data-qid={id} value={answer.value}></div>);
        }
         switch(type) {
            case "radiolist":
                return(
                      <button id={id+"_button"} data-id={(aIndex)} data-qid={id} key={aIndex} data-pid={pid?pid:""} type="button" value={answer.value} 
                         className={"btn ans_button backgroundHover color_1 "+((that.state.answers[id]&&that.state.answers[id]==(""+answer.value))?"background":"")}
                         onClick={that.handleRadiolistButton}>
                          {icon}{answer.text}
                      </button>
                    )
            break;              
            case "checklist":   
                 var found = false;
                 if (that.state.answers[id]){
                     var answersA = that.state.answers[id];
                     if (Array.isArray(answersA)){
                        found = answersA.indexOf(""+answer.value)!=-1;
                     }else{
                         found = (( answersA==-1 && answer.value == -1 )?true:false)
                     }
                 }
                 return(
                      <button id={id+"_button_"+aIndex} data-id={(aIndex)} data-qid={id} key={aIndex} data-pid={pid?pid:""} type="button" 
                         className={"btn ans_button backgroundHover color_1 "+(found==true?"background":"")}
                         onClick={that.handleChecklistButton} value={answer.value}>
                          {icon}{answer.text}
                      </button>
                    )
            break;
            case "dropdown":
               return(
                      <option id={id+"_option"} data-id={(aIndex)} key={aIndex} type="button" data-pid={pid?pid:""} className="" value={answer.value} >&nbsp;&nbsp;{answer.text}&nbsp;&nbsp;</option>
                    )  
            break;
            case "default":
              return(<span></span>)
            break;
          }

        })
        return structure;
    }
    
    render() {
        let that = this;
        return (
            <DocumentTitle title="GIG Questions">
                <section className="questionnaire_container content_wrapper container">
                <style>{`body{background-color:#ededed;}`}</style>
                {that.generateQuestions(that.state.questions)}
                </section>
            </DocumentTitle>
        )
    }
    
}

export default Questionnaire;