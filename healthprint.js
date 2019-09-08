var population = 1316000;
var life_expectancy = {
    "Men": 75.,
    "Women": 81.7,
    "Average": 78.3,
    "Average+DALY": 78.3+6.02
};

var disease_impact_years_lost_overall = [
    {"disease": "Tumors"                                            , "Alcohol": 2971, "Obesity":  1059 , "Smoking": 11088, "Low veggies": 7786, "Low exercise": 2828  },
    {"disease": "Cardiovascular disease"                            , "Alcohol": 4913, "Obesity":  12639, "Smoking": 10902, "Low veggies": 4914, "Low exercise": 20515 },
    {"disease": "Psychiatric diseases"                              , "Alcohol": 1922, "Obesity":  0    , "Smoking": 0    , "Low veggies": 0   , "Low exercise": 103   },
    {"disease": "Musculoskeletal Disorders"                         , "Alcohol": 0   , "Obesity":  2863 , "Smoking": 0    , "Low veggies": 0   , "Low exercise": 521   },
    {"disease": "Other diseases"                                    , "Alcohol": 0   , "Obesity":  605  , "Smoking": 403  , "Low veggies": 0   , "Low exercise": 119   },
    {"disease": "External causes"                                   , "Alcohol": 7574, "Obesity":  0    , "Smoking": 523  , "Low veggies": 0   , "Low exercise": 991   },
    {"disease": "Diseases of the digestive tract"                   , "Alcohol": 4867, "Obesity":  79   , "Smoking": 25   , "Low veggies": 0   , "Low exercise": 0     },
    {"disease": "Respiratory diseases"                              , "Alcohol": 0   , "Obesity":  0    , "Smoking": 5293 , "Low veggies": 0   , "Low exercise": 0     },
    {"disease": "Neurological diseases"                             , "Alcohol": 0   , "Obesity":  0    , "Smoking": -30  , "Low veggies": 0   , "Low exercise": 0     },
    {"disease": "Malformations and conditions related to childbirth", "Alcohol": 0   , "Obesity":  0    , "Smoking": 31   , "Low veggies": 0   , "Low exercise": 0     },
];

var disease_to_prevalance = {
    "Alcohol": 0.22,
    "Obesity":  0.5,
    "Smoking": 0.23,
    "Low veggies": 0.7,
    "Low exercise": 0.52
}


function calculateYearsLostByDisease(disease_type, gender="Average+DALY") {
    var yearsLost = 0.;
    for (disease_i in disease_impact_years_lost_overall) {
        disease = disease_impact_years_lost_overall[disease_i]
        if ( disease["disease"] != disease_type ) {
            continue;
        }

        for (risk_behaviour in disease) {
            if (risk_behaviour  == "disease") {
                continue
            }

            yearsLost += disease[risk_behaviour] / population * (1. / disease_to_prevalance[risk_behaviour]);
        }
    }

    return yearsLost * life_expectancy[gender];
};


function calculateYearsLostByBehaviour(behaviour, user_survey, gender="Average+DALY") {
    var yearsLost = 0.;
    for (disease_i in disease_impact_years_lost_overall) {
        disease = disease_impact_years_lost_overall[disease_i]

        for (risk_behaviour in disease) {
            if (risk_behaviour  == "disease") {
                continue
            }

            if ( risk_behaviour != behaviour) {
                continue;
            }
            yearsLost += disease[risk_behaviour] / population * (1. / disease_to_prevalance[risk_behaviour]) * user_survey[risk_behaviour];

        }
    }

    return yearsLost * life_expectancy[gender]+;
};

function calculateYearsLost(user_survey)
{
    var yearsLost = 0;
    yearsLost += calculateYearsLostByBehaviour("Alcohol",      user_survey  )
    yearsLost += calculateYearsLostByBehaviour("Smoking",      user_survey  )
    yearsLost += calculateYearsLostByBehaviour("Low veggies",  user_survey  )
    yearsLost += calculateYearsLostByBehaviour("Low exercise", user_survey  )
    yearsLost += calculateYearsLostByBehaviour("Obesity",      user_survey  )

    return yearsLost ;
}

function calculateDirectHealthcareCostByBehaviour(behaviour) {
    return health_care_costs[behaviour]
}
function calculateDirectHealthcareCost(user_survey, gender="Average+DALY") {
    var euorsLost = 0;

    euorsLost += calculateDirectHealthcareCostByBehaviour("Alcohol",      user_survey  ) * life_expectancy[gender] * user_survey["Alcohol"];
    euorsLost += calculateDirectHealthcareCostByBehaviour("Smoking",      user_survey  ) * life_expectancy[gender] * user_survey["Smoking"];
    euorsLost += calculateDirectHealthcareCostByBehaviour("Low veggies",  user_survey  ) * life_expectancy[gender] * user_survey["Low veggies"];
    euorsLost += calculateDirectHealthcareCostByBehaviour("Low exercise", user_survey  ) * life_expectancy[gender] * user_survey["Low exercise"];
    euorsLost += calculateDirectHealthcareCostByBehaviour("Obesity",      user_survey  ) * life_expectancy[gender] * user_survey["Obesity"];

    return euorsLost ;
};

// Final national numbers
var total_national_productivity_loss    = 602261635.06;
var total_national_direct_illness_cost  = 90787083.54;
var total_national_cost_risk_behaviours = 285317591.66;
var avg_national_productivity_loss = 34323.42;
var avg_national_direct_illness_cost = 5405.14;

var gdp_per_capita = 17700.00;
var balancing_index = 3.1057; // inaccuracies in our method

var user_survey = { // binary for if you're currently in risk group
    "Alcohol":      if current_state["Alcohol"] > 8 then 1 else 0
    "Obesity":      if current_state["Obesity"] > 25 then 1 else 0,
    "Smoking":      current_state["Smoking"],
    "Low veggies":  if current_state["Low veggies"] < 6 then 1 else 0,
    "Low exercise": current_state["Low exercise"]
}

var previous_state = { //currently example numbers for last year's state
    "Alcohol":      12, // units consumed in a week
    "Obesity":      28, // BMI
    "Smoking":      0, // binary for smoking, 0 if out of risk group
    "Low veggies":  5, // days per week vegetables consumed
    "Low exercise": 0 // binary for doing over 2 hours a week, 0 if out of risk group
}

var current_state = { //example numbers for this year's state, used for binary in user_survey
    "Alcohol":      10, // units consumed in a week
    "Obesity":      25, // BMI
    "Smoking":      0, // binary for smoking, 0 if out of risk group
    "Low veggies":  5, // days per week vegetables consumed
    "Low exercise": 0 // binary for doing over 2 hours a week, 0 if out of risk group
}


var future_state = { //example numbers for your predicted state in one year, binary of whether in risk group or not
    "Alcohol":      1,
    "Obesity":      0, 
    "Smoking":      0, 
    "Low veggies":  0, 
    "Low exercise": 0 
}

var goal_values = { //Values you need to reach to be outside the risk group
    "Alcohol":      8,
    "ObesityMin":   18.5, 
    "ObesityMax":   24.9,
    "Smoking":      0, 
    "Low veggies":  6, 
    "Low exercise": 0 
}    


var health_care_costs = {
    "Alcohol":      81.62376844,
    "Obesity":      30.88390731,
    "Smoking":      49.84880167,
    "Low veggies":  7.2878363,
    "Low exercise": 36.57933277,
}

var total_for_average = {
    "Alcohol": 9533.41,
    "Obesity": 7509.09,
    "Smoking": 11236.70,
    "Low veggies": 5064.00,
    "Low exercise": 10674.66
}

var total_for_risk_group = {
    "Alcohol": 43344.641,
    "Obesity": 15022.12,
    "Smoking": 48856.79,
    "Low veggies": 7200.25,
    "Low exercise": 20487.01   
}


console.log("\n");
console.log("Tumors"                                            , calculateYearsLostByDisease(  "Tumors"                                                       ));
console.log("Cardiovascular disease"                            , calculateYearsLostByDisease(  "Cardiovascular disease"                                       ));
console.log("Psychiatric diseases"                              , calculateYearsLostByDisease(  "Psychiatric diseases"                                         ));
console.log("Musculoskeletal Disorders"                         , calculateYearsLostByDisease(  "Musculoskeletal Disorders"                                    ));
console.log("Other diseases"                                    , calculateYearsLostByDisease(  "Other diseases"                                               ));
console.log("External causes"                                   , calculateYearsLostByDisease(  "External causes"                                              ));
console.log("Diseases of the digestive tract"                   , calculateYearsLostByDisease(  "Diseases of the digestive tract"                              ));
console.log("Respiratory diseases"                              , calculateYearsLostByDisease(  "Respiratory diseases"                                         ));
console.log("Neurological diseases"                             , calculateYearsLostByDisease(  "Neurological diseases"                                        ));
console.log("Malformations and conditions related to childbirth", calculateYearsLostByDisease(  "Malformations and conditions related to childbirth"           ));
console.log("\n");

console.log("Alcohol",      calculateYearsLostByBehaviour("Alcohol",      user_survey  ));
console.log("Smoking",      calculateYearsLostByBehaviour("Smoking",      user_survey  ));
console.log("Low veggies",  calculateYearsLostByBehaviour("Low veggies",  user_survey  ));
console.log("Low exercise", calculateYearsLostByBehaviour("Low exercise", user_survey  ));
console.log("Obesity",      calculateYearsLostByBehaviour("Obesity",      user_survey  ));
console.log("\n");

console.log("Total", calculateYearsLost( user_survey ));
console.log("\n");

console.log("Lost productivity over lifetime",
   gdp_per_capita *  calculateYearsLost( user_survey ) / balancing_index, "€");

console.log("Direct healthcare costs",
    calculateDirectHealthcareCost(user_survey), "€");

console.log("Total loss over your lifetime",
    (gdp_per_capita *  calculateYearsLost( user_survey ) / balancing_index) + calculateDirectHealthcareCost(user_survey), "€");

console.log("Your difference compared to the national average",
    ((gdp_per_capita *  calculateYearsLost( user_survey ) / balancing_index) + calculateDirectHealthcareCost(user_survey)) -
            (avg_national_productivity_loss + avg_national_direct_illness_cost), "€");

console.log("Your relative difference",
    ((gdp_per_capita *  calculateYearsLost( user_survey ) / balancing_index) + calculateDirectHealthcareCost(user_survey)) /
            (avg_national_productivity_loss + avg_national_direct_illness_cost) - 1, "%");

// Example calculation of progress numbers based on alcohol consumption
console.log("Last year you were consuming ", previous_state["Alcohol"], " units of alcohol. This year your consumption rate has been ",
    current_state["Alcohol"], "units of alcohol per week. Your progress towards a healthy lifestyle has been ", 
        ((previous_state["Alcohol"] - current_state["Alcohol"]) / (previous_state["Alcohol"] - goal_values["Alcohol"])), "%!!!!");

console.log("\n");
console.log("National total productivity loss per year", total_national_productivity_loss   , "€");
console.log("National total healthcare cost per year"  , total_national_direct_illness_cost , "€");
console.log("Total public cost of risk behaviours"     , total_national_cost_risk_behaviours, "€");
