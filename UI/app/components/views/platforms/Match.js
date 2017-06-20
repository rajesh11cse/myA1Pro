import React from 'react';
import Nav from '../../nav/nav';
import Footer from '../../footer/footer';
import DocumentTitle from "react-document-title";
import {STRINGS} from '../../_utility/constants';
import {Link} from 'react-router';


class Match extends React.Component {
    
    constructor(props) {
        super(props);
        var state = {
            platforms : [],
            flow : [],
            answers : [],
            selected : [],
        };
        var pid_list = [];
        sessionStorage.setItem("pid_list",pid_list);
      
        this.toggleSelect = this.toggleSelect.bind(this);

        this.state = state;
    }
    
    componentDidMount(){
        let that = this;
        let ans;
	    try {
            const serializedState = sessionStorage.getItem('answers');
            if (serializedState === null) {
              ans = undefined;
            }
            ans = JSON.parse(serializedState);
          } catch (err) {
            ans = undefined;
          }
        that.setState({
            answers : ans
        },function(){
            //console.log(that.state.answers)
        })
        this.setDataInState();
    }
    
    setDataInState() {
        var that = this;      
        var state = [];
        var aux = [];
        var interestedPFs = [];
        
        state["platforms"] = [
            {
                name : "POSTMATES",
                id : "p-0001",
                logo : "postmates.png",
                about : "Postmates is transforming the way goods move around cities by enabling anyone to have anything delivered on-demand.",
                role : "Earn up to $25/hour making deliveries from local restaurants and shops.  Work are much as you want.  Choose your transportation – Postmates walk, drive, scoot, and bike.",
                url : "https://postmates.com/",
                conditions: {
                    score : 2,
                    tier : [1,3]
                }
            },
            {
                name : "Wag!",
                id : "p-0002",
                logo : "wag.png",
                about : "Wag! makes dog ownership easier by connecting dog owners with dog lovers in their community to hire on-demand for dog walking, dog sitting, or dog boarding services 7-days a week.",
                role : "Earn money by spending quality time with dogs.  Become a dog walker, sitter, or boarder.",
                url : "https://wagwalking.com/",
                conditions: {
                    score : 2,
                    tier : [6]
                }
            },
            {
                name : "Handy",
                id : "p-0003",
                logo : "handy.png",
                about : "Handy connects individuals looking for household services with top-quality, pre-screened independent services professionals, from home cleaning to handyman services.",
                role : "Handyman or cleaning person.",
                ur : "https://www.handy.com/",
                conditions: {
                    score : 1,
                    tier : [4,5]
                }
            }
        ];
        
        state["flow"] = ["q-001","q-002","q-003","q-004","q-005",["q-006","q-006-01"],["q-007","q-007-02"]]
            
        that.setState({
            flow : state.flow,
            platforms : state.platforms,
        },function(){
            for ( let i = 0 ; i < state["platforms"].length ; i++ ){
                let platform = state["platforms"][i];
                if ( platform.conditions && that.state.answers && that.score(platform.conditions) ){
                    aux.push(platform);
                    interestedPFs.push(platform.id);
                }
            }
            sessionStorage.setItem("totalPFs",interestedPFs);
            state["platforms"] = aux;
            that.setState({
                platforms : state["platforms"],
            })
        });

    }
    
    score(cond){
        let score = 0;
        let index = 0;
        let ans = this.state.answers;
        let flow = this.state.flow;
        var arr = cond.tier;
        for( var i = 0 ; i < arr.length ; i++ ){
            var level = cond.tier[i];
            var el = flow[level];
            if (Array.isArray(el)){
                for (let j = 0 ; j < el.length ; j++ ){
                    if ( Array.isArray(ans[el[j]]) || ans[el[j]] == "1" ){
                        score++;
                    }
                }
            }else{
                if ( Array.isArray(ans[el]) || ans[el] == "1" ){
                    score++;
                }
            }
        }
        if ( score >= cond.score ){
            return true;
        }else{
            return false;
        }
    }
    
    toggleSelect(e){
        
        let that = this;
        let pid = e.target.getAttribute("data-pid");
        let name = e.target.value;
        let list = that.state.selected;
        if( !list[pid] ){
            list[pid] = name;
        }else{
            delete list[pid];
        }

        var pid_list = [];
        for(var key in list){
            // console.log(key,list[key]);
            pid_list.push(key);
        }
        sessionStorage.setItem("pid_list",pid_list);

        that.setState({
            selected : list
        })
        //comment
    }

    render() {
        
        let that = this;
        let platforms = that.state.platforms;
        let matchedPlatforms = platforms.length;
        let selected = that.state.selected;
        let selectedItems = Object.keys(selected).length;
        // console.log("selected",selected);
        return (
            <DocumentTitle title="GIG Matches">
                <section id="main" className="matches_container content_wrapper container">
                <style>{`body{background-color:#ededed;}`}</style>
                <div className="container">
                   
                    <div className="row text-center">
                       <div className="container-fluid">
                           
                       
                        <h1>Thank You!</h1>
                        
                        { ( matchedPlatforms > 0 ) &&
                            <div>
                            <h6 className="margin-bottom-30">Great job! Based on the information you’ve provided you are qualified for the following gigs.  <br></br>Please let us know which ones you’d like to be connected to.</h6>
                            </div>
                        }
                        { ( matchedPlatforms <= 0 ) &&
                            <div>
                            <h6 className="margin-bottom-30">Sorry, based on the information you’ve provided, we have no gigs available for your current skills.<br></br>Please keep in tuch and keep an eye on your email, we'll let you know as soon as we find a cool gig for you.</h6>
                            </div>
                        }
                        
                        </div>
                    </div>
                    
                    {   platforms.map(function(platform,index){

                              let id = platform.id;
                              return (
                                    <div id={"platform_"+id} class="container-fluid margin-bottom-30 match_element" key={index}>

                                         <div class="box-shadow row">  
                                            <div className="row"> 
                                                 <div class="col-lg-2 col-md-3 col-sm-4 col-xs-12">
                                                   <div className="img-thumbnail">
                                                       <a target="_blank" href={platform.url}><img className="platform_logo" src={"public/img/platforms/"+platform.logo}></img></a>
                                                   </div>
                                                   <button type="button" 
                                                       class={"btn gig_button background backgroundHover "+(that.state.selected[id]?" color_1":" color_2")} 
                                                       data-pid={id} 
                                                       value={platform.name}
                                                       onClick={that.toggleSelect}>{"Interested"+(that.state.selected[id]?" ✓ ":" ? ")}</button>
                                                 </div>
                                                 <div class="col-lg-10 col-md-9 col-sm-8 col-xs-12 match_summary">
                                                     <h5>
                                                         <span>{platform.name}</span> <a 
                                                         class="learnMore textHover color_1" 
                                                         target="_blank" 
                                                         href={platform.url}
                                                         > Learn more</a>
                                                     </h5>
                                                     <p>
                                                         <strong>About Company</strong>
                                                         <br></br>
                                                         {platform.about}
                                                     </p>
                                                     <p>
                                                         <strong>Role</strong>
                                                         <br></br>
                                                         {platform.role}
                                                     </p> 
                                                 </div>   
                                            </div>
                                        </div>

                                    </div>
                                  )
                              }

                                      
                            )
                    }
                    
                    <div className="col-xs-12 question_nav text-center">
                        {selectedItems < 1 &&
                             <button id="" type="button" className={"btn gig_button background backgroundHover color_2 disabledButton"}>Next</button>
                        }
                        {selectedItems >= 1 &&
                             <Link className={"btn gig_button background backgroundHover color_1"} to="/PersonalInformation">Next</Link>
                        }
                    </div>
                    
                </div>
                </section>
            </DocumentTitle>
        )
    }
    
}

export default Match;