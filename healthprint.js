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


function calculateYearsLostByDisease(disease_type, gender="Average") {
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

    return yearsLost * life_expectancy["Average+DALY"];
};


function calculateYearsLostByBehaviour(behaviour, user_survey, gender="Average") {
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

    return yearsLost * life_expectancy["Average+DALY"]+;
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
function calculateDirectHealthcareCost(user_survey, gender="Average") {
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

var gdp_per_capita = 17700.00;
var balancing_index = 3.1057; // inaccuracies in our method

var user_survey = {
    "Alcohol":      1,
    "Obesity":      1,
    "Smoking":      1,
    "Low veggies":  1,
    "Low exercise": 1
}

var health_care_costs = {
    "Alcohol":      81.62376844,
    "Obesity":      30.88390731,
    "Smoking":      49.84880167,
    "Low veggies":  7.2878363,
    "Low exercise": 36.57933277,
}

console.log("Expected length of life", life_expectancy["Average"])
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

console.log("\n");
console.log("National total productivity loss per year", total_national_productivity_loss   , "€");
console.log("National total healthcare cost per year"  , total_national_direct_illness_cost , "€");
console.log("Total public cost of risk behaviours"     , total_national_cost_risk_behaviours, "€");
