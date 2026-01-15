export interface RawOption {
    name: string;
    value: string;
    tamil_name?: string; // Add if present in your data
    telugu_name?: string; // Add if present in your data
    image_url?: string;
    description?: string;
    id?: string;
    newName?: string; // Add if present
    hindiNewName?: string; // Add if present
    hindi_name?: string; // Add if present
    sub_text?:string;
    destination_image_url?:string;
}

export interface RawQuestionConfig {
    id: string;
    component: string;
    group: string;
    next?: string | null;
    reply: string;
    tag: string;
    text: string;
    tamil_text?: string;
    telugu_text?: string;
    type: string;
    optionMap?: RawOption[];
    fn?: { if?: unknown[] };
    sub_text?: string | string[];
    showImages?: boolean;
    absoluteImagePath?: boolean;
    dataLayerName?: string;
    whyWeAsk?: { show: boolean; text: string };
    tamilQuestionOptions?: RawOption[];
    imagesForQuestion?: { url: string }[];
    max?: number; // For multiple_choice with limits
    checkSubgroup?: boolean;
    slots?: string; // For GET_SLOTS_API
}
export type QuizConfig = {
  questions: RawQuestionConfig[];
};

export const RAW_QUIZ_CONFIG: { questions: RawQuestionConfig[] } = {
  "questions": [
    {
      "id": "first_name",
      "component": "inputName",
      "group": "basic_information",
      "next": "phone_number",
      "reply": "",
      "tag": "user",
      "text": "Before we start, can we get your name?",
      "tamil_text": "Start panradhuku munnadi, unga per ennanu solunga ",
      "type": "text"
    },
    {
      "id": "phone_number",
      "component": "inputPhoneNumber",
      "group": "basic_information",
      "next": "C1d",
      "reply": "",
      "sub_text": "",
      "tag": "user",
      "text": "Phone Number",
      "tamil_text": "Phone Number",
      "type": "tel"
    },
    {
      "id": "email",
      "component": "inputEmail",
      "group": "basic_information",
      "next": "C1d",
      "reply": "",
      "tag": "user",
      "text": "Email",
      "tamil_text": "Email",
      "type": "text"
    },
    {
      "id": "C1d",
      "component": "inputAge",
      "group": "basic_information",
      "next": "gender",
      "reply": "",
      "tag": "form",
      "text": "How old are you?",
      "tamil_text": "Unga vayasu enna?",
      "type": "tel"
    },
    {
      "id": "gender",
      "component": "inputRadioV2",
      "group": "basic_information",
      "next": "2e",
      "reply": "",
      "tag": "user",
      "text": "Gender",
      "tamil_text": "Gender",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Male",
          "value": "M"
        },
        {
          "name": "Female",
          "value": "F"
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "M"
            ]
          },
          "2e",
          "hair_type"
        ]
      }
    },
    {
      "id": "male-branch",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "3e",
      "reply": "",
      "tag": "form",
      "text": "Do you have dandruff?",
      "tamil_text": "Ungaluku dandruff iruka?",
      "dataLayerName": "dandruff",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "tamil_name": "Illai",
          "value": "No"
        },
        {
          "name": "Mild dandruff (small white flakes)",
          "tamil_name": "Irukku, romba mild’ah appo appo vandhu pogum.",
          "value": "Yes, mild that comes and goes"
        },
        {
          "name": "Heavy dandruff (sticky dandruff found in nails on scratching or visible on clothes)",
          "tamil_name": "Irukku,scalp la heavy dandruff epovume irukku.",
          "value": "Yes, heavy dandruff that sticks to the scalp"
        },
        {
          "name": "Diagnosed with Psoriasis / Seborrheic Dermatitis",
          "tamil_name": "Enaku psoriasis irukku.",
          "value": "Diagnosed with Psoriasis / Seborrheic Dermatitis",
          "description": "A skin condition that causes red, dry patches on your scalp."
        }
      ]
    },
    {
      "id": "male-dandruff-pic",
      "component": "inputRadio",
      "group": "hair_assessment",
      "next": "male-dandruff-duration",
      "reply": "",
      "showImages": true,
      "absoluteImagePath": true,
      "tag": "form",
      "text": "Choose the picture that best matches your scalp",
      "dataLayerName": "dandruffImage",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Dry Powder Dandruff",
          "value": "Dry Powder Dandruff",
          "image_url": "Native_pages_images/form_images/dandruff/dry_powder.webp",
          "sub_text": "Small, dry flakes in your hair"
        },
        {
          "name": "Flaky Dandruff",
          "value": "Flaky Dandruff",
          "image_url": "Native_pages_images/form_images/dandruff/flaky_dandruff.webp",
          "sub_text": "Big, noticeable flakes",
          "description": "White thin pieces that come off when scratched or rubbed."
        },
        {
          "name": "Sticky Dandruff",
          "value": "Sticky Dandruff",
          "image_url": "Native_pages_images/form_images/dandruff/sticky_dandruff.webp",
          "sub_text": "Flakes that stick to your hair and scalp"
        },
        {
          "name": "Psoriasis",
          "value": "Psoriasis",
          "image_url": "Native_pages_images/form_images/dandruff/psoriasis.webp",
          "sub_text": "Rough patches on your scalp, with hair thinning",
          "description": "A skin condition that causes red, dry patches on your scalp."
        },
        {
          "name": "Seborrheic Dermatitis",
          "value": "Seborrheic Dermatitis",
          "image_url": "Native_pages_images/form_images/dandruff/seborrheic_dermatitis.webp",
          "sub_text": "Red, scaly scalp with hair loss at the sides of forehead.",
          "description": "A condition making your scalp itchy, red with a burning feeling."
        }
      ],
      "whyWeAsk": {
        "show": false,
        "text": "Help in better precscription of kit."
      }
    },
    {
      "id": "male-dandruff-duration",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "3e",
      "reply": "",
      "tag": "form",
      "text": "How long have you been facing dandruff?",
      "dataLayerName": "dandruffHistory",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "1 to 6 months",
          "value": "0 to 6 months"
        },
        {
          "name": "6 months to 1 year",
          "value": "6 to 12 months"
        },
        {
          "name": "Last 2 to 3 years",
          "value": "2 to 3 years"
        },
        {
          "name": "More than 3 years",
          "value": "more than 3 years"
        }
      ],
      "whyWeAsk": {
        "show": false,
        "text": "Helps in better prescription of kit."
      }
    },
    {
      "id": "2c",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "male_experiance",
      "reply": "",
      "tag": "form",
      "text": "Do you have a family history of hair loss?",
      "tamil_text": "Unga family history’la hairloss iruka?",
      "dataLayerName": "familyHistory",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Mother or anyone from mother's side of the family",
          "tamil_name": "Amma or amma side family la yaarkavadhu",
          "value": "Mother or anyone from mother's side of the family"
        },
        {
          "name": "Father or anyone from father's side of the family",
          "tamil_name": "Appa or appa side family la yaarkadvadhu",
          "value": "Father or anyone from father's side of the family"
        },
        {
          "name": "Both",
          "tamil_name": "Both",
          "value": "Both"
        },
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        }
      ]
    },
    {
      "id": "treatments",
      "component": "inputCheckbox",
      "group": "hair_assessment",
      "next": "male_experiance",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "What hair loss treatments have you tried before?",
      "tamil_text": "What hair loss treatments have you tried before?",
      "telugu_text": "What hair loss treatments have you tried before?",
      "dataLayerName": "",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "telugu_name": "None",
          "value": "None"
        },
        {
          "name": "Minoxidil",
          "tamil_name": "Minoxidil",
          "telugu_name": "Minoxidil",
          "value": "Minoxidil"
        },
        {
          "name": "PRP",
          "tamil_name": "PRP",
          "telugu_name": "PRP",
          "value": "PRP"
        },
        {
          "name": "Hair transplant",
          "tamil_name": "Hair transplant",
          "telugu_name": "Hair transplant",
          "value": "Hair transplant"
        },
        {
          "name": "Other",
          "tamil_name": "Other",
          "telugu_name": "Other",
          "value": "Other"
        }
      ]
    },
    {
      "id": "2e",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "2c-stage2",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Which image best describes your hair loss?",
      "tamil_text": "Unga hairloss’uh kurikira best image edhu?",
      "dataLayerName": "stage",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Stage-1",
          "tamil_name": "Stage-1",
          "newName": "Little hair loss",
          "hindiNewName": "Little hair loss",
          "hindi_name": "Stage-1",
          "value": "Stage-1",
          "id": "Stage-1",
          "image_url": "male/stage1/image_m_1.webp",
          "destination_image_url": "male/stage1/image_m_2.webp"
        },
        {
          "name": "Stage-2",
          "tamil_name": "Stage-2",
          "newName": "Slightly visible scalp",
          "hindiNewName": "Slightly visible scalp",
          "hindi_name": "Stage-2",
          "value": "Stage-2",
          "id": "Stage-2",
          "image_url": "male/stage2/image_m_1.webp",
          "destination_image_url": "male/stage2/image_m_2.webp"
        },
        {
          "name": "Stage-3",
          "tamil_name": "Stage-3",
          "newName": "Hairline moving back",
          "hindiNewName": "Hairline moving back",
          "hindi_name": "Stage-3",
          "value": "Stage-3",
          "id": "Stage-3",
          "image_url": "male/stage3/image_m_1.webp",
          "destination_image_url": "male/stage3/image_m_2.webp"
        },
        {
          "name": "Stage-4",
          "tamil_name": "Stage-4",
          "newName": "Bald crown, thinning sides",
          "hindiNewName": "Bald crown, thinning sides",
          "hindi_name": "Stage-4",
          "value": "Stage-4",
          "id": "Stage-4",
          "image_url": "male/stage4/image_m_1.webp",
          "destination_image_url": "male/stage4/image_m_2.webp"
        },
        {
          "name": "Stage-5",
          "tamil_name": "Stage-5",
          "newName": "Front & crown hair almost gone",
          "hindiNewName": "Front & crown hair almost gone",
          "hindi_name": "Stage-5",
          "value": "Stage-5",
          "id": "Stage-5",
          "image_url": "male/stage5/image_m_1.webp",
          "destination_image_url": "male/stage5/image_m_2.webp"
        },
        {
          "name": "Stage-6",
          "tamil_name": "Stage-6",
          "newName": "Minimal hair left",
          "hindiNewName": "Minimal hair left",
          "hindi_name": "Stage-6",
          "value": "Stage-6",
          "id": "Stage-6",
          "image_url": "male/stage6/image_m_1.webp",
          "destination_image_url": "male/stage6/image_m_2.webp"
        },
        {
          "name": "Coin Size Patch",
          "tamil_name": "Coin Size Patch",
          "newName": "Coin size patch",
          "hindiNewName": "Coin size patch",
          "hindi_name": "Coin Size Patch",
          "value": "Coin Size Patch",
          "id": "Stage-7",
          "image_url": "male/coinSizePatch/image_m_1.webp",
          "destination_image_url": "male/coinSizePatch/image_m_2.webp"
        },
        {
          "name": "Heavy Hair Fall",
          "tamil_name": "Heavy Hair Fall",
          "newName": "Heavy hair fall",
          "hindiNewName": "Heavy hair fall",
          "hindi_name": "Heavy Hair Fall",
          "value": "Heavy Hair Fall",
          "id": "Stage-8",
          "image_url": "male/heavyHairFall/image_m_1.webp",
          "destination_image_url": "male/heavyHairFall/image_m_2.webp"
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "Stage-2"
            ]
          },
          "2c-stage2",
          {
            "==": [
              {
                "var": "reply"
              },
              "Stage-3"
            ]
          },
          "2c-stage3",
          {
            "==": [
              {
                "var": "reply"
              },
              "Stage-4"
            ]
          },
          "2c-stage4",
          {
            "==": [
              {
                "var": "reply"
              },
              "Stage-5"
            ]
          },
          "2c-stage5",
          "2c"
        ]
      }
    },
    {
      "id": "2c-stage2",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "2c",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Where are you noticing hair loss?",
      "tamil_text": "Enga elam hairfall notice panringa?",
      "dataLayerName": "noticingHairLoss",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Front only",
          "tamil_name": "Front’la mattum",
          "value": "Front only",
          "id": "Front only",
          "image_url": "male/stage2/image_s_f_front.webp"
        },
        {
          "name": "At the top of the head only",
          "tamil_name": "Top of the head mattum",
          "value": "At the top of the head only",
          "id": "At the top of the head only",
          "image_url": "male/stage2/image_s_t_top.webp"
        },
        {
          "name": "Both front and top of the head",
          "tamil_name": "Top and front of the head.",
          "value": "Both front and top of the head",
          "id": "Both front and top of the head",
          "image_url": "male/stage2/image_s_b_both.webp"
        }
      ]
    },
    {
      "id": "2c-stage3",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "2c",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Where are you noticing hair loss?",
      "tamil_text": "Enga elam hairfall notice panringa?",
      "dataLayerName": "noticingHairLoss",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Front only",
          "tamil_name": "Front’la mattum",
          "value": "Front only",
          "id": "Front only",
          "image_url": "male/stage3/image_s_f_front.webp"
        },
        {
          "name": "At the top of the head only",
          "tamil_name": "Top of the head mattum",
          "value": "At the top of the head only",
          "id": "At the top of the head only",
          "image_url": "male/stage3/image_s_t_top.webp"
        },
        {
          "name": "Both front and top of the head",
          "tamil_name": "Top and front of the head.",
          "value": "Both front and top of the head",
          "id": "Both front and top of the head",
          "image_url": "male/stage3/image_s_b_both.webp"
        }
      ]
    },
    {
      "id": "2c-stage4",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "2c",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Where are you noticing hair loss?",
      "tamil_text": "Enga elam hairfall notice panringa?",
      "dataLayerName": "noticingHairLoss",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Front only",
          "tamil_name": "Front’la mattum",
          "value": "Front only",
          "id": "Front only",
          "image_url": "male/stage4/image_s_f_front.webp"
        },
        {
          "name": "At the top of the head only",
          "tamil_name": "Top of the head mattum",
          "value": "At the top of the head only",
          "id": "At the top of the head only",
          "image_url": "male/stage4/image_s_t_top.webp"
        },
        {
          "name": "Both front and top of the head",
          "tamil_name": "Top and front of the head.",
          "value": "Both front and top of the head",
          "id": "Both front and top of the head",
          "image_url": "male/stage4/image_s_b_both.webp"
        }
      ]
    },
    {
      "id": "2c-stage5",
      "component": "inputRadioV4",
      "group": "hair_assessment",
      "next": "2c",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Where are you noticing hair loss?",
      "tamil_text": "Enga elam hairfall notice panringa?",
      "dataLayerName": "noticingHairLoss",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Front only",
          "tamil_name": "Front’la mattum",
          "value": "Front only",
          "id": "Front only",
          "image_url": "male/stage5/image_s_f_front.webp"
        },
        {
          "name": "At the top of the head only",
          "tamil_name": "Top of the head mattum",
          "value": "At the top of the head only",
          "id": "At the top of the head only",
          "image_url": "male/stage5/image_s_t_top.webp"
        },
        {
          "name": "Both front and top of the head",
          "tamil_name": "Top and front of the head.",
          "value": "Both front and top of the head",
          "id": "Both front and top of the head",
          "image_url": "male/stage5/image_s_b_both.webp"
        }
      ]
    },
    {
      "id": "male_experiance",
      "component": "inputCheckbox",
      "group": "hair_assessment",
      "next": "male-branch",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Have you experienced any of the below in the last 1 year?",
      "tamil_text": "Last year’la indha list’la irukra edhachu neenga experience paningala?",
      "dataLayerName": "last1year",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Severe Health issues (Dengue, Malaria, Typhoid or Covid)",
          "tamil_name": "Severe Health issues (Dengue, Malaria, Typhoid or Covid)",
          "value": "Severe Illness (Dengue, Malaria, Typhoid or Covid)"
        },
        {
          "name": "Heavy weight loss / heavy weight gain",
          "tamil_name": "Heavy weight loss / heavy weight gain",
          "value": "Heavy weight loss / heavy weight gain"
        },
        {
          "name": "Surgery / heavy medication",
          "tamil_name": "Surgery / heavy medication",
          "value": "Surgery / heavy medication"
        }
      ]
    },
    {
      "id": "hair_fall_treatment",
      "component": "inputCheckbox",
      "group": "hair_assessment",
      "next": "3b",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Have you taken any of the below treatment for hair fall?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None"
        },
        {
          "name": "Hair transplant",
          "value": "Hair transplant"
        },
        {
          "name": "PRP treatment",
          "value": "PRP treatment"
        },
        {
          "name": "Minoxidil",
          "value": "Minoxidil"
        },
        {
          "name": "Other Medications",
          "value": "Other Medications"
        }
      ]
    },
    {
      "id": "hair_transplant",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3b",
      "reply": "",
      "tag": "form",
      "text": "When was the transplant done?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Recently",
          "value": "Recently"
        },
        {
          "name": "6 months to 1 year",
          "value": "6 months to 1 year"
        },
        {
          "name": "More than a year",
          "value": "More than a year"
        }
      ]
    },
    {
      "id": "minoxidile_serum",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "minoxidile_issue",
      "reply": "",
      "tag": "form",
      "text": "How long did you use Minoxidil serum for?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Less than 1 month",
          "value": "Less than 1 month"
        },
        {
          "name": "1 to 6 months",
          "value": "1 to 6 months"
        },
        {
          "name": "more than 6 months",
          "value": "more than 6 months"
        }
      ]
    },
    {
      "id": "minoxidile_issue",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3b",
      "reply": "",
      "tag": "form",
      "text": "Did you face any issue with using Minoxidil?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "other_medications",
      "component": "UserFeedback",
      "group": "lifestyle_questions",
      "next": "3b",
      "reply": "",
      "tag": "user",
      "text": "Please share if possible what have you used before, this will help our hair experts plan your treatment better",
      "type": "text"
    },
    {
      "id": "3b",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3f1",
      "reply": "",
      "tag": "form",
      "text": "How are your energy levels during the day?",
      "tamil_text": "Unga energy levels epdi irku?",
      "dataLayerName": "energy",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Always high / Normal energy levels throughout the day",
          "tamil_name": "Epovume High",
          "value": "Always high"
        },
        {
          "name": "Low when I wake up, then gradually increase",
          "tamil_name": "Kaalaila ezhundhirikumbodhu low ah irkum, poga poga energy increase aagum",
          "value": "Low when I wake up, but gradually increases"
        },
        {
          "name": "Very low in the afternoon",
          "tamil_name": "Afternoon romba low ah irkum",
          "value": "Very low in afternoon"
        },
        {
          "name": "Low by evening/night",
          "tamil_name": "Evening/Night low aaidum",
          "value": "Low by evening/night"
        },
        {
          "name": "Always low",
          "tamil_name": "Eppovume low’ah dhan irkum.",
          "value": "Always low"
        }
      ]
    },
    {
      "id": "3c",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3di",
      "reply": "",
      "tag": "form",
      "text": "Do you feel constipated? (कब्ज़)",
      "tamil_text": "Constipated’uh feel panringala?",
      "dataLayerName": "constipation",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No / Once in a while",
          "tamil_name": "No/Rarely",
          "value": "No/Rarely"
        },
        {
          "name": "Yes (fewer than 3 stools a week)",
          "tamil_name": "Yes",
          "value": "Yes"
        },
        {
          "name": "Unable to pass stool properly / feeling unsatisfied after passing stools",
          "tamil_name": "Unsatisfactory bowel movements",
          "value": "Unsatisfactory bowel movements"
        },
        {
          "name": "Suffering from Irritable Bowel Syndrome",
          "tamil_name": "Suffering from IBS (irritable bowel syndrome) /dysentery",
          "value": "Suffering from IBS (irritable bowel syndrome) /dysentery"
        }
      ]
    },
    {
      "id": "3di",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3b",
      "reply": "",
      "tag": "form",
      "text": "Do you have Gas, Acidity or Bloating?",
      "tamil_text": "Ungaluku gas, acidity or bloating irka?",
      "dataLayerName": "bloating",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "tamil_name": "No",
          "value": "No"
        },
        {
          "name": "Sometimes (1-2 times a week or when I eat out)",
          "tamil_name": "Sometimes (1-2 times a week or when I eat out)",
          "value": "Sometimes (1-2 times a week or when I eat out)"
        },
        {
          "name": "Often (3+ times a week)",
          "tamil_name": "Often (3+ times a week)",
          "value": "Often (3+ times a week)"
        }
      ]
    },
    {
      "id": "3d",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "male_health_condition",
      "reply": "",
      "tag": "form",
      "text": "How stressed are you?",
      "tamil_text": "Unga stress level epdi irku?",
      "dataLayerName": "stress",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Low",
          "tamil_name": "Low",
          "value": "Low"
        },
        {
          "name": "Moderate(work, family etc )",
          "tamil_name": "Moderate (work, family etc)",
          "value": "Moderate(work, family etc )"
        },
        {
          "name": "High (Loss of close one, separation, home, illness)",
          "tamil_name": "High (Loss of close one, separation, home, illness)",
          "value": "High (Loss of close one, separation, home, illness)"
        }
      ]
    },
    {
      "id": "male_health_condition",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "3c",
      "reply": "",
      "tag": "form",
      "text": "Are you currently dealing with any of these health conditions?",
      "tamil_text": "Indha conditions edhachu ungalku irukka?",
      "dataLayerName": "healthCondition",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Asthma",
          "tamil_name": "Asthma",
          "value": "Asthma"
        },
        {
          "name": "Sinus Problems",
          "tamil_name": "Sinus Problems",
          "value": "Sinus Problems"
        }
      ]
    },
    {
      "id": "3e",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3d",
      "reply": "",
      "tag": "form",
      "text": "How well do you sleep?",
      "tamil_text": "Evlo nalla neenga thoonguvinga?",
      "dataLayerName": "sleep",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Very peacefully for 6-8 hours",
          "tamil_name": "6-8 hours nalla, peaceful aana sleep.",
          "value": "Very peacefully for 6 to 8 hours"
        },
        {
          "name": "Disturbed sleep (wake up multiple times at night)",
          "tamil_name": "Disturbed sleep, nadu rathrila oru vaatiyachu ezhundhiruven.",
          "value": "Disturbed sleep, I wake up at least one time during the night"
        },
        {
          "name": "Difficulty falling asleep",
          "tamil_name": "Odane thoongradhu kashtapaduven.",
          "value": "Have difficulty falling asleep"
        }
      ]
    },
    {
      "id": "3f",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3j",
      "reply": "",
      "tag": "form",
      "text": "Are you currently taking any supplements or vitamins for hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes",
          "id": "Answer 1"
        },
        {
          "name": "No",
          "value": "No",
          "id": "Answer 2"
        },
        {
          "name": "Not Sure",
          "value": "Not Sure",
          "id": "Answer 3"
        }
      ]
    },
    {
      "id": "3f1",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "3j",
      "reply": "",
      "tag": "form",
      "text": "Are you currently taking any supplements or vitamins for hair?",
      "tamil_text": "Edhachu hair supplements, or vitamins edukuringala?",
      "dataLayerName": "supplements",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "tamil_name": "Yes",
          "value": "Yes",
          "id": "Answer 1"
        },
        {
          "name": "No",
          "tamil_name": "No",
          "value": "No",
          "id": "Answer 2"
        }
      ],
      "tamilQuestionOptions": [
        {
          "name": "Yes",
          "tamil_name": "Yes",
          "value": "Yes",
          "id": "Answer 1"
        },
        {
          "name": "No",
          "tamil_name": "No",
          "value": "No",
          "id": "Answer 2"
        },
        {
          "name": "Not Sure",
          "tamil_name": "Not Sure",
          "value": "Not Sure",
          "id": "Answer 3"
        }
      ]
    },
    {
      "id": "3i",
      "component": "inputCheckboxV4",
      "group": "hair_assessment",
      "next": "2c",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "What are your major hair goals?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Regrow hair",
          "value": "Regrow hair"
        },
        {
          "name": "Control hair fall",
          "value": "Control hair fall"
        },
        {
          "name": "I have a good set of hair, I want to maintain it.",
          "value": "I have a good set of hair, I want to maintain it."
        },
        {
          "name": "Work on hair quality",
          "value": "Work on hair quality"
        },
        {
          "name": "Delay greying",
          "value": "Delay greying"
        }
      ]
    },
    {
      "id": "3j",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Do you have Blood Pressure problem?",
      "tamil_text": "Idhula edhachu health issue face panringala?",
      "dataLayerName": "bloodPressure",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Yes, high BP issue",
          "tamil_name": "Yes, high BP issue",
          "value": "Yes, high BP issue"
        },
        {
          "name": "Yes, low BP issue",
          "tamil_name": "Yes, low BP issue",
          "value": "Yes, low BP issue"
        }
      ],
      "tamilQuestionOptions": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Yes, high BP issue",
          "tamil_name": "Yes, high BP issue",
          "value": "Yes, high BP issue"
        },
        {
          "name": "Yes, low BP issue",
          "tamil_name": "Yes, low BP issue",
          "value": "Yes, low BP issue"
        },
        {
          "name": "Thyroid",
          "tamil_name": "Thyroid",
          "value": "Thyroid"
        },
        {
          "name": "Cholestrol",
          "tamil_name": "Cholestrol",
          "value": "Cholestrol"
        }
      ]
    },
    {
      "id": "language",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Choose your preferred language for hair coach communication.",
      "tamil_text": "Choose your preferred language for hair coach communication.",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Hindi",
          "tamil_name": "Hindi",
          "value": "Hindi"
        },
        {
          "name": "English",
          "tamil_name": "English",
          "value": "English"
        },
        {
          "name": "Tamil",
          "tamil_name": "Tamil",
          "value": "Tamil"
        },
        {
          "name": "Telugu",
          "tamil_name": "Telugu",
          "value": "Telugu"
        },
        {
          "name": "Kannada",
          "tamil_name": "Kannada",
          "value": "Kannada"
        }
      ]
    },
    {
      "id": "hair_goals",
      "component": "inputCheckbox",
      "group": "know_your_hair",
      "max": 3,
      "next": "describe_dandruff",
      "reply": "",
      "sub_text": "Choose upto three goals",
      "tag": "form",
      "text": "Hair Goals",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Anti-Hairfall",
          "value": "Anti-Hairfall"
        },
        {
          "name": "Anti-Dandruff",
          "value": "Anti-Dandruff"
        },
        {
          "name": "More Volume",
          "value": "More Volume"
        },
        {
          "name": "More Length",
          "value": "More Length"
        },
        {
          "name": "Hair Greying",
          "value": "Hair Greying"
        },
        {
          "name": "Overall Health",
          "value": "Overall Health"
        },
        {
          "name": "Hair Damage",
          "value": "Hair Damage"
        }
      ]
    },
    {
      "id": "suffering_from_dandruff",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "currently_using_for_dandruff",
      "reply": "",
      "tag": "form",
      "text": "How long have you been suffering from dandruff?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "It's seasonal comes and goes",
          "value": "It's seasonal comes and goes"
        },
        {
          "name": "For the last 2-3 years",
          "value": "For the last 2-3 years"
        },
        {
          "name": "For more than 3 years",
          "value": "For more than 3 years"
        },
        {
          "name": "I have a scalp condition",
          "value": "I have a scalp condition"
        }
      ]
    },
    {
      "id": "currently_using_for_dandruff",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "hairfall_description",
      "reply": "",
      "tag": "form",
      "text": "What are you currently using for your dandruff?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Home remedies like lemon, curd and neem",
          "value": "Home remedies like lemon, curd and neem"
        },
        {
          "name": "Medicated shampoo with Salicylic acid, Ketoconazole, Zinc Pythrione",
          "value": "Medicated shampoo with Salicylic acid, Ketoconazole, Zinc Pythrione"
        },
        {
          "name": "Anti-dandruff shampoo from popular brands",
          "value": "Anti-dandruff shampoo from popular brands"
        },
        {
          "name": "Regular shampoo",
          "value": "Regular shampoo"
        }
      ]
    },
    {
      "id": "hairfall_description",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "family_history",
      "reply": "",
      "showImages": true,
      "tag": "form",
      "text": "Describe your hair fall",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Heavy hairfall",
          "value": "Heavy hairfall",
          "image_url": "female-hair-fall-describe/heavy-hair-fall.svg"
        },
        {
          "name": "Thinner hair throughout",
          "value": "Thinner hair throughout",
          "image_url": "female-hair-fall-describe/thinner-hair-throughout.svg"
        },
        {
          "name": "Hair breakage",
          "value": "Hair breakage",
          "image_url": "female-hair-fall-describe/hair-brekage.svg"
        },
        {
          "name": "Widened partition",
          "value": "Widened partition",
          "image_url": "female-hair-fall-describe/widened-partition.svg"
        },
        {
          "name": "Coin sized patches",
          "value": "Coin sized patches",
          "image_url": "female-hair-fall-describe/coin-sized-patches.svg"
        }
      ]
    },
    {
      "id": "family_history",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "hair_damage_description",
      "reply": "",
      "tag": "form",
      "text": "Is hair loss in your family history?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes, Mother or mother's side of the family",
          "value": "Yes, Mother or mother's side of the family"
        },
        {
          "name": "Yes, Father or father's side of the family",
          "value": "Yes, Father or father's side of the family"
        },
        {
          "name": "Both",
          "value": "Both"
        },
        {
          "name": "None",
          "value": "None"
        }
      ]
    },
    {
      "id": "hair_damage_description",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "any_chemical_treatment",
      "reply": "",
      "tag": "form",
      "text": "Describe your hair damage",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Dull hair",
          "value": "Dull hair"
        },
        {
          "name": "Split ends",
          "value": "Split ends"
        },
        {
          "name": "Frizzy hair",
          "value": "Frizzy hair"
        },
        {
          "name": "Tangles easily with knots",
          "value": "Tangles easily with knots"
        }
      ]
    },
    {
      "id": "any_chemical_treatment",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "hair_thickness",
      "reply": "",
      "tag": "form",
      "text": "Did you go through any chemical treatment recently?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes, hair coloring",
          "value": "Yes, hair coloring"
        },
        {
          "name": "Yes, keratin treatment",
          "value": "Yes, keratin treatment"
        },
        {
          "name": "Yes, bond treatments",
          "value": "Yes, bond treatments"
        },
        {
          "name": "No treatments",
          "value": "No treatments"
        },
        {
          "name": "Other treatments",
          "value": "Other treatments"
        }
      ]
    },
    {
      "id": "hair_thickness",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "strads_lost",
      "reply": "",
      "tag": "form",
      "text": "How thick is each strand of your hair",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Thin",
          "value": "Thin"
        },
        {
          "name": "Medium",
          "value": "Medium"
        },
        {
          "name": "Thick",
          "value": "Thick"
        }
      ]
    },
    {
      "id": "strads_lost",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "hair_length",
      "reply": "",
      "tag": "form",
      "text": "How many strands do you lose in a day?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "50-100 strands",
          "value": "50-100 strands"
        },
        {
          "name": "100-150 strands",
          "value": "100-150 strands"
        },
        {
          "name": "More than 150 strands",
          "value": "More than 150 strands"
        }
      ]
    },
    {
      "id": "hair_length",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "hair_color_duration",
      "reply": "",
      "tag": "form",
      "text": "What is the current length of your hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Ear length",
          "value": "Ear length"
        },
        {
          "name": "Shoulder length",
          "value": "Shoulder length"
        },
        {
          "name": "Waist length",
          "value": "Waist length"
        },
        {
          "name": "Longer",
          "value": "Longer"
        }
      ]
    },
    {
      "id": "hair_color_duration",
      "component": "inputRadio",
      "group": "know_your_hair",
      "checkSubgroup": true,
      "next": "4m",
      "reply": "",
      "tag": "form",
      "text": "Do you often color your hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Every 3 months",
          "value": "Every 3 months"
        },
        {
          "name": "Twice a year",
          "value": "Twice a year"
        },
        {
          "name": "Once a year",
          "value": "Once a year"
        },
        {
          "name": "Never",
          "value": "Never"
        }
      ]
    },
    {
      "id": "4m",
      "component": "inputRadio",
      "group": "lifestyle_questions",
      "checkSubgroup": true,
      "next": "suffering_from_conditions",
      "reply": "",
      "tag": "form",
      "text": "Are you going through any of these stages?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Pregnancy",
          "value": "Pregnancy"
        },
        {
          "name": "Post-pregnancy",
          "value": "Post-pregnancy"
        },
        {
          "name": "Menopause",
          "value": "Menopause",
          "description": "You don’t get monthly periods anymore."
        },
        {
          "name": "Post-Covid",
          "value": "Post-Covid"
        },
        {
          "name": "None",
          "value": "None"
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "Post-pregnancy"
            ]
          },
          "4ma",
          "suffering_from_conditions"
        ]
      }
    },
    {
      "id": "4ma",
      "component": "inputRadio",
      "group": "lifestyle_questions",
      "next": "suffering_from_conditions",
      "reply": "",
      "type": "single_choice",
      "tag": "form",
      "text": "Are you breastfeeding?",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "suffering_from_conditions",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "checkSubgroup": true,
      "next": "4k",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Are you suffering from any of these conditions?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Irregular periods (Pcos)",
          "value": "Irregular periods (Pcos)",
          "description": "When a woman’s ovaries have tiny bumps and she might have trouble with her periods and hormones."
        },
        {
          "name": "Anaemia",
          "value": "Anaemia"
        },
        {
          "name": "Thyroid",
          "value": "Thyroid"
        },
        {
          "name": "Vitamin/ Other deficiency",
          "value": "Vitamin/ Other deficiency"
        },
        {
          "name": "Hormonal imbalance",
          "value": "Hormonal imbalance"
        },
        {
          "name": "None",
          "value": "None"
        }
      ]
    },
    {
      "id": "4k",
      "component": "inputRadio",
      "group": "lifestyle_questions",
      "checkSubgroup": true,
      "next": "4j",
      "reply": "",
      "tag": "form",
      "text": "How well do you sleep?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Peacefully for 6-8 hours",
          "value": "Peacefully for 6-8 hours"
        },
        {
          "name": "Disturbed sleep, I wake up atleast once a night",
          "value": "Disturbed sleep, I wake up atleast once a night"
        },
        {
          "name": "Have difficulty falling asleep",
          "value": "Have difficulty falling asleep"
        }
      ]
    },
    {
      "id": "4j",
      "component": "inputRadio",
      "group": "lifestyle_questions",
      "checkSubgroup": true,
      "next": "gut_problems",
      "reply": "",
      "tag": "form",
      "text": "How stressed are you?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Not at all",
          "value": "Not at all"
        },
        {
          "name": "Low",
          "value": "Low"
        },
        {
          "name": "Moderate",
          "value": "Moderate"
        },
        {
          "name": "High",
          "value": "High"
        }
      ]
    },
    {
      "id": "gut_problems",
      "component": "inputRadio",
      "group": "lifestyle_questions",
      "next": "4h",
      "reply": "",
      "tag": "form",
      "text": "Do you have any gut problems?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None"
        },
        {
          "name": "Acidity",
          "value": "Acidity"
        },
        {
          "name": "Indigestion",
          "value": "Indigestion"
        },
        {
          "name": "Constipation",
          "value": "Constipation",
          "description": "कब्ज़"
        },
        {
          "name": "IBS",
          "value": "IBS"
        },
        {
          "name": "Stomach pain or discomfort",
          "value": "Stomach pain or discomfort"
        },
        {
          "name": "Bloating and Gas",
          "value": "Bloating and Gas"
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "None"
            ]
          },
          "photo_q",
          "4h"
        ]
      }
    },
    {
      "id": "4h",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Describe your energy levels",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Low when I wake up, but gradually increases",
          "value": "Low when I wake up, but gradually increases"
        },
        {
          "name": "Very low in afternoon",
          "value": "Very low in afternoon"
        },
        {
          "name": "Low by evening/night",
          "value": "Low by evening/night"
        },
        {
          "name": "Always low",
          "value": "Always low"
        }
      ]
    },
    {
      "id": "4q",
      "component": "inputSlotsV4",
      "group": "scalp_photo",
      "next": "photo_q",
      "reply": "",
      "slots": "GET_SLOTS_API",
      "type": "single_choice",
      "tag": "form",
      "text": "Would you like to book a free appointment with our hair expert?",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes",
          "id": "4q_option1"
        },
        {
          "name": "I'll do this later",
          "value": "I'll do this later",
          "id": "4q_option2"
        }
      ]
    },
    {
      "id": "hair_type",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hair_goals2",
      "reply": "",
      "tag": "form",
      "text": "What does your hair look like naturally?",
      "tamil_text": "Unga natural hair type enna?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Straight",
          "value": "Straight",
          "tamil_name": "Straight"
        },
        {
          "name": "Wavy",
          "value": "Wavy",
          "tamil_name": "Wavy"
        },
        {
          "name": "Curly",
          "value": "Curly",
          "tamil_name": "Curly"
        },
        {
          "name": "Coily",
          "value": "Coily",
          "tamil_name": "Coily"
        }
      ]
    },
    {
      "id": "hair_quality",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "hair_feel",
      "reply": "",
      "tag": "form",
      "text": "Describe your hair quality",
      "tamil_text": "Unga Hair quality’uh describe pannunga.",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Good Hair Quality",
          "value": "Good Hair Quality",
          "tamil_name": "Good Hair Quality"
        },
        {
          "name": "Damaged Hair",
          "value": "Damaged Hair",
          "tamil_name": "Damaged Hair"
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "Damaged Hair"
            ]
          },
          "hair_quality1",
          "hair_feel"
        ]
      }
    },
    {
      "id": "hair_quality1",
      "component": "inputCheckbox",
      "group": "know_your_hair",
      "next": "hair_feel",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "How would you describe your hair damage?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Dull hair",
          "value": "Dull hair"
        },
        {
          "name": "Split ends",
          "value": "Split ends"
        },
        {
          "name": "Frizzy hair",
          "value": "Frizzy hair"
        },
        {
          "name": "Tangles easily with knots",
          "value": "Tangles easily with knots"
        },
        {
          "name": "None",
          "value": "None"
        }
      ]
    },
    {
      "id": "hair_vol",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hair_feel",
      "reply": "",
      "tag": "form",
      "text": "How dense is your hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Very dense",
          "value": "Very dense"
        },
        {
          "name": "Medium volume",
          "value": "Medium volume"
        },
        {
          "name": "Low volume",
          "value": "Low volume"
        }
      ],
      "fn": {
        "if": [
          {
            "!==": [
              {
                "var": "reply"
              },
              "Very dense"
            ]
          },
          "hair_vol1",
          "hair_feel"
        ]
      }
    },
    {
      "id": "hair_vol1",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "hair_quality",
      "checkSubgroup": true,
      "showImages": true,
      "reply": "",
      "tag": "form",
      "text": "Where do you stand on the Female Hair Scale?",
      "tamil_text": "Indha Female Hair Scale’la neenga enga irkinga?",
      "sub_text": "Which picture best describes your current hair condition ",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Hair Thinning",
          "value": "Hair Thinning",
          "tamil_name": "Hair Thinning",
          "image_url": "female-hair-fall-describe/hairThinningBefore.png",
          "sub_text": "Loss of hair volume overall, no visible scalp"
        },
        {
          "name": "Less volume on the sides",
          "value": "side_widening",
          "tamil_name": "Less volume on the sides",
          "image_url": "female-hair-fall-describe/side_widening.png",
          "sub_text": "Scalp visible on sides"
        },
        {
          "name": "Medium Widening",
          "value": "Medium Widening",
          "tamil_name": "Medium Widening",
          "image_url": "female-hair-fall-describe/newMediumWidening.png",
          "sub_text": "Increased gap in middle partition"
        },
        {
          "name": "Advanced Widening",
          "value": "Advanced Widening",
          "tamil_name": "Advanced Widening",
          "image_url": "female-hair-fall-describe/newAdvancedWidening.png",
          "sub_text": "Extreme hair thinning on the partition"
        },
        {
          "name": "Coin size patches",
          "value": "Coin size patches",
          "tamil_name": "Coin size patches",
          "image_url": "female-hair-fall-describe/newCoin.png",
          "sub_text": "Small patches on head or other body parts"
        }
      ]
    },
    {
      "id": "hair_goals2",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "feel_hair_fall",
      "reply": "",
      "tag": "form",
      "text": "What is your most important goal currently?",
      "tamil_text": "Ungaloda most important, current hair goal enna?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Control Hairfall",
          "value": "Control Hairfall",
          "tamil_name": "Hair fall control pannanum"
        },
        {
          "name": "Regrow Hair",
          "value": "Regrow Hair",
          "tamil_name": "Hair regrow pannanum"
        },
        {
          "name": "Improve Hair Quality",
          "value": "Improve Hair Quality",
          "tamil_name": "Hair quality improve pannanum"
        }
      ]
    },
    {
      "id": "hair_feel",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hard_water",
      "reply": "",
      "tag": "form",
      "text": "What does a single strand of your hair feel like?",
      "tamil_text": "Unga single strand of hair epdi irkum?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Thin",
          "value": "Thin",
          "tamil_name": "Thin"
        },
        {
          "name": "Medium",
          "value": "Medium",
          "tamil_name": "Medium"
        },
        {
          "name": "Thick",
          "value": "Thick",
          "tamil_name": "Thick"
        }
      ]
    },
    {
      "id": "hard_water",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "fhf2",
      "reply": "",
      "tag": "form",
      "text": "Do you see white powdery deposits in your bathroom taps, tiles, and buckets? (This could be indicating hard/ khara water)",
      "type": "single_choice",
      "imagesForQuestion": [
        {
          "url": "website_images/hairtest/floor.webp"
        },
        {
          "url": "website_images/hairtest/tap.webp"
        }
      ],
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "feel_hair_fall",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hair_vol1",
      "reply": "",
      "tag": "form",
      "text": "Do you feel like you're facing Hair Fall more than usual?",
      "tamil_text": "Usual’uh vida, adhiga hair fall face panra maari feel panringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes, extreme hair fall",
          "value": "Yes, extreme hair fall",
          "tamil_name": "Yes, extreme hair fall"
        },
        {
          "name": "Mild hair fall",
          "value": "Mild hair fall",
          "tamil_name": "Mild hair fall"
        },
        {
          "name": "No Hair fall",
          "value": "No Hair fall",
          "tamil_name": "No Hair fall"
        }
      ]
    },
    {
      "id": "fhf1",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "feel_oily",
      "reply": "",
      "tag": "form",
      "text": "How many strands do you lose in a day?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "50 - 100 strands",
          "value": "50 - 100 strands"
        },
        {
          "name": "100 - 150 strands",
          "value": "100 - 150 strands"
        },
        {
          "name": "More than 150 strands",
          "value": "More than 150 strands"
        }
      ],
      "fn": {
        "if": [
          {
            "!==": [
              {
                "var": "reply"
              },
              "More than 150 stands"
            ]
          },
          "fhf2",
          "feel_oily"
        ]
      }
    },
    {
      "id": "fhf2",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "feel_oily",
      "reply": "",
      "tag": "form",
      "text": "Is hair loss a genetic issue in your family?",
      "tamil_text": "Unga family’la hair loss oru genetic problem’ah?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes, Mother or mother's side of family",
          "value": "Yes, Mother or mother's side of family",
          "tamil_name": "Yes, Mother or mother's side of family"
        },
        {
          "name": "Yes, Father or father's side of family",
          "value": "Yes, Father or father's side of family",
          "tamil_name": "Yes, Father or father's side of family"
        },
        {
          "name": "Both",
          "value": "Both",
          "tamil_name": "Both"
        },
        {
          "name": "None",
          "value": "None",
          "tamil_name": "None"
        }
      ]
    },
    {
      "id": "feel_oily",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "describe_dandruff",
      "reply": "",
      "tag": "form",
      "text": "How long after hair wash does your hair start to feel oily?",
      "tamil_text": "Hair wash pannadhuku aprom, epolendhu unga hair oily’uh feel panna start aagum?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Within 24 hours",
          "value": "Within 24 hours",
          "tamil_name": "Within 24 hours"
        },
        {
          "name": "2-3 days",
          "value": "2-3 days",
          "tamil_name": "2-3 days"
        },
        {
          "name": "More than 4 days",
          "value": "More than 4 days",
          "tamil_name": "More than 4 days"
        }
      ]
    },
    {
      "id": "describe_dandruff",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "female_stage",
      "reply": "",
      "tag": "form",
      "text": "Describe your dandruff.",
      "tamil_text": "Unga dandruff’uh describe pannunga.",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "value": "No",
          "tamil_name": "No"
        },
        {
          "name": "Yes, Mild that comes & goes",
          "value": "Yes, Mild that comes & goes",
          "tamil_name": "Yes, Mild that comes & goes"
        },
        {
          "name": "Yes, Heavy dandruff that sticks to the scalp",
          "value": "Yes, Heavy dandruff that sticks to the scalp",
          "tamil_name": "Yes, Heavy dandruff that sticks to the scalp"
        },
        {
          "name": "I have Psoriasis",
          "value": "I have Psoriasis",
          "tamil_name": "I have Psoriasis",
          "description": "A skin condition that causes red, dry patches on your scalp."
        },
        {
          "name": "I have Seborrheic Dermatitis",
          "value": "I have Seborrheic Dermatitis",
          "tamil_name": "I have Seborrheic Dermatitis",
          "description": "A condition making your scalp itchy, red with a burning feeling."
        }
      ]
    },
    {
      "id": "female_stage",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "female_experiance",
      "reply": "",
      "tag": "form",
      "text": "Are you going through any of these stages?",
      "tamil_text": "Idhula iruka stages edhachu ippo go through panringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None",
          "tamil_name": "None"
        },
        {
          "name": "Planning to get pregnant",
          "value": "Planning to get pregnant",
          "tamil_name": "Planning to get pregnant"
        },
        {
          "name": "Pregnancy",
          "value": "Pregnancy",
          "tamil_name": "Pregnancy"
        },
        {
          "name": "Post-pregnancy (Baby is less than 2 years old)",
          "value": "Post-pregnancy",
          "tamil_name": "Post-pregnancy (Baby is less than 2 years old)"
        },
        {
          "name": "Menopause",
          "value": "Menopause",
          "tamil_name": "Menopause",
          "description": "You don’t get monthly periods anymore."
        }
      ],
      "fn": {
        "if": [
          {
            "==": [
              {
                "var": "reply"
              },
              "Post-pregnancy"
            ]
          },
          "fs2",
          "female_experiance"
        ]
      }
    },
    {
      "id": "fs1",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "female_experiance",
      "reply": "",
      "tag": "form",
      "text": "Are you taking any Prenatal Vitamins?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "fs2",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "female_experiance",
      "reply": "",
      "tag": "form",
      "text": "Are you currently breast feeding?",
      "tamil_text": "Currently breast feeling panringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes",
          "tamil_name": "Yes"
        },
        {
          "name": "No",
          "value": "No",
          "tamil_name": "No"
        }
      ]
    },
    {
      "id": "fs3",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "female_experiance",
      "reply": "",
      "tag": "form",
      "text": "Are you facing any of this? (If menopause)",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Mood swings",
          "value": "Mood swings"
        },
        {
          "name": "Hot flashes",
          "value": "Hot flashes"
        },
        {
          "name": "Cramps",
          "value": "Cramps"
        },
        {
          "name": "None",
          "value": "None"
        }
      ]
    },
    {
      "id": "female_experiance",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "female_cond",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Have you experienced any of the below in last 1 year?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None"
        },
        {
          "name": "Severe Illness (Dengue, Malaria, Typhoid or Covid)",
          "value": "Severe Illness (Dengue, Malaria, Typhoid or Covid)"
        },
        {
          "name": "Heavy weight loss or heavy weight gain",
          "value": "Heavy weight loss or heavy weight gain"
        },
        {
          "name": "Surgery or on heavy medication",
          "value": "Surgery or on heavy medication"
        }
      ]
    },
    {
      "id": "female_cond",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "vitamin_def_female_combined",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Are you going through any of the below?",
      "tamil_text": "Idhula edhachu oru condition ungalluku irka?",
      "checkSubgroup": true,
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None",
          "tamil_name": "None"
        },
        {
          "name": "Anemia (Low Haemoglobin)",
          "value": "Anemia (Low Haemoglobin)",
          "tamil_name": "Anemia (Low Haemoglobin)"
        },
        {
          "name": "Low Thyroid (Hypothyroidism)",
          "value": "Low Thyroid (Hypothyroidism)",
          "tamil_name": "Low Thyroid (Hypothyroidism)"
        },
        {
          "name": "PCOS",
          "value": "PCOS",
          "tamil_name": "PCOS",
          "description": "When a woman’s ovaries have tiny bumps and she might have trouble with her periods and hormones."
        },
        {
          "name": "Other Hormonal Issues",
          "value": "Other Hormonal Issues",
          "tamil_name": "Other Hormonal Issues"
        }
      ]
    },
    {
      "id": "vitamin_def",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "sleep_check",
      "reply": "",
      "tag": "form",
      "text": "Do you have any Vitamin defeciencies that you are aware of?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        },
        {
          "name": "Not sure",
          "value": "Not sure"
        }
      ],
      "whyWeAsk": {
        "show": true,
        "text": "Several vitamin deficiencies can lead to compromised hair and skin health. Hence, we ask for this information to recommend a supplement formula that's balanced for you while preventing vitamin overdose."
      }
    },
    {
      "id": "vitamin_def1",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "sleep_check",
      "reply": "",
      "tag": "form",
      "text": "Are you currently eating any vitamin tablets?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "vitamin_def_female_combined",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "sleep_check",
      "reply": "",
      "tag": "form",
      "text": "Are you currently taking any supplements or vitamins for hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "value": "No"
        },
        {
          "name": "Yes",
          "value": "Yes"
        }
      ],
      "whyWeAsk": {
        "show": true,
        "text": "Several vitamin deficiencies can lead to compromised hair and skin health. Hence, we ask for this information to recommend a supplement formula that's balanced for you while preventing vitamin overdose."
      }
    },
    {
      "id": "sleep_check",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "asthma_sinus",
      "reply": "",
      "tag": "form",
      "text": "How well do you sleep?",
      "tamil_text": "Evlo nalla neenga thoonguvinga?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Peacefully for 6-8 hours",
          "value": "Peacefully for 6-8 hours",
          "tamil_name": "Peacefully for 6-8 hours"
        },
        {
          "name": "Disturbed sleep, I wake up atleast once a night",
          "value": "Disturbed sleep, I wake up atleast once a night",
          "tamil_name": "Disturbed sleep, I wake up atleast once a night"
        },
        {
          "name": "Have difficulty falling asleep",
          "value": "Have difficulty falling asleep",
          "tamil_name": "Have difficulty falling asleep"
        }
      ]
    },
    {
      "id": "asthma_sinus",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "stress_check",
      "reply": "",
      "tag": "form",
      "text": "Do you currently experience any of the following health conditions?",
      "tamil_text": "Idhula edhachu condition face panringala?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None",
          "tamil_name": "None"
        },
        {
          "name": "Sinus Issue",
          "value": "sinus",
          "tamil_name": "Sinus Issue"
        },
        {
          "name": "Asthma",
          "value": "asthma",
          "tamil_name": "Asthma"
        }
      ],
      "whyWeAsk": {
        "show": false,
        "text": "Asthma and sinus can  affect your hair treatment and recomendation"
      }
    },
    {
      "id": "stress_check",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "feel_consitpate",
      "reply": "",
      "tag": "form",
      "text": "How stressed are you?",
      "tamil_text": "Neenga evlo stressed’uh irkinga",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Not at all",
          "value": "Not at all",
          "tamil_name": "Not at all"
        },
        {
          "name": "Low",
          "value": "Low",
          "tamil_name": "Low"
        },
        {
          "name": "Moderate",
          "value": "Moderate",
          "tamil_name": "Moderate"
        },
        {
          "name": "High",
          "value": "High",
          "tamil_name": "High"
        }
      ]
    },
    {
      "id": "feel_consitpate",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "check_bloat",
      "reply": "",
      "tag": "form",
      "text": "Do you feel constipated? (कब्ज़)",
      "tamil_text": "Constipated’uh feel panringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "value": "No",
          "tamil_name": "No"
        },
        {
          "name": "Yes",
          "value": "Yes",
          "tamil_name": "Yes"
        },
        {
          "name": "I have IBS",
          "value": "I have IBS",
          "tamil_name": "I have IBS"
        }
      ]
    },
    {
      "id": "check_bloat",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "energy_level",
      "reply": "",
      "tag": "form",
      "text": "Do you have Acidity, Bloating, Gas or Indigestion?",
      "tamil_text": "Ungalluku gas, acidity, bloating or indigestion irka?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "value": "No",
          "tamil_name": "No"
        },
        {
          "name": "Yes",
          "value": "Yes",
          "tamil_name": "Yes"
        }
      ]
    },
    {
      "id": "energy_level",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "female_bp",
      "reply": "",
      "tag": "form",
      "text": "Describe your energy levels",
      "tamil_text": "Unga energy levels’uh describe pannunga.",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Always high",
          "value": "Always high",
          "tamil_name": "Always high"
        },
        {
          "name": "Low when I wake up, but gradually increases",
          "value": "Low when I wake up, but gradually increases",
          "tamil_name": "Low when I wake up, but gradually increases"
        },
        {
          "name": "Very low in the afternoon",
          "value": "Very low in the afternoon",
          "tamil_name": "Very low in the afternoon"
        },
        {
          "name": "Low by evening/ night",
          "value": "Low by evening/ night",
          "tamil_name": "Low by evening/ night"
        },
        {
          "name": "Always low",
          "value": "Always low",
          "tamil_name": "Always low"
        }
      ]
    },
    {
      "id": "female_bp",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Are you suffering through any of these medical conditions?",
      "tamil_text": "Indha medical conditions laam suffer panringala?",
      "sub_text": "Select at least one option",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None",
          "tamil_name": "None"
        },
        {
          "name": "High Blood Pressure",
          "value": "High Blood Pressure",
          "tamil_name": "High Blood Pressure"
        },
        {
          "name": "Low Blood Pressure",
          "value": "Low Blood Pressure",
          "tamil_name": "Low Blood Pressure"
        },
        {
          "name": "Liver Cirrhosis or deranged LFT (Liver Function Test)",
          "value": "Liver Cirrhosis or deranged LFT ",
          "tamil_name": "Liver Cirrhosis or deranged LFT (Liver Function Test)"
        },
        {
          "name": "Blood disorders (epilepsy, history of stroke)",
          "value": "Blood disorders",
          "tamil_name": "Blood disorders (epilepsy, history of stroke)"
        },
        {
          "name": "Cardiovascular disorders (history of heart attack, arrhythmia, pace maker, stroke)",
          "value": "Cardiovascular disorders",
          "tamil_name": "Cardiovascular disorders (history of heart attack, arrhythmia, pace maker, stroke)"
        }
      ]
    },
    {
      "id": "preferred_language",
      "component": "inputRadioV2",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Choose your language",
      "sub_text": "We will let your hair coach know about your preference",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "English",
          "value": "english"
        },
        {
          "name": "Hindi",
          "value": "hindi"
        },
        {
          "name": "Marathi",
          "value": "marathi"
        },
        {
          "name": "Kannada",
          "value": "kannada"
        },
        {
          "name": "Tamil",
          "value": "tamil"
        },
        {
          "name": "Bengali",
          "value": "bengali"
        },
        {
          "name": "Telugu",
          "value": "telugu"
        },
        {
          "name": "Malayalam",
          "value": "malayalam"
        }
      ]
    },
    {
      "id": "photo_q",
      "component": "inputImage",
      "group": "scalp_photo",
      "next": null,
      "reply": "",
      "sub_text": [
        "Hair Experts- To analyse and prescribe your kit's dosage.",
        "Hair Coaches- To track your hair progress."
      ],
      "tag": "form",
      "text": "Upload your scalp picture, for our hair experts to check.",
      "tamil_text": "Hair experts check panradhuku, unga scalp picture inga upload pannunga",
      "type": "file"
    },
    {
      "id": "hair_concern1",
      "component": "inputCheckbox",
      "group": "know_your_hair",
      "next": "hair_styling",
      "reply": "",
      "tag": "form",
      "text": "What are your concerns with hair quality?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Dryness",
          "value": "Dryness"
        },
        {
          "name": "Dullness",
          "value": "Dullness"
        },
        {
          "name": "Split ends",
          "value": "Split ends"
        },
        {
          "name": "Frizziness",
          "value": "Frizziness"
        },
        {
          "name": "Tangles easily",
          "value": "Tangles easily"
        },
        {
          "name": "Hair Breakage",
          "value": "Hair Breakage"
        }
      ]
    },
    {
      "id": "hair_styling",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "chemical_treatment",
      "reply": "",
      "tag": "form",
      "text": "Do you use any hair styling products like straightner, curler, blow dryer, etc?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Never",
          "value": "Never"
        },
        {
          "name": "On special occasions",
          "value": "On special occasions"
        },
        {
          "name": "After every wash",
          "value": "After every wash"
        }
      ]
    },
    {
      "id": "chemical_treatment",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "hair_colouring",
      "reply": "",
      "tag": "form",
      "text": "Have you recently got any chemical treatment done for your hair?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "value": "None"
        },
        {
          "name": "Keratin treatment",
          "value": "Keratin treatment"
        },
        {
          "name": "Permanent straightening",
          "value": "Permanent straightening"
        },
        {
          "name": "Rebonding",
          "value": "Rebonding"
        },
        {
          "name": "Hair Botox",
          "value": "Hair Botox"
        },
        {
          "name": "Smoothening",
          "value": "Smoothening"
        }
      ]
    },
    {
      "id": "hair_colouring",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "water_type",
      "reply": "",
      "tag": "form",
      "text": "Do you color your hair?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Never",
          "value": "Never"
        },
        {
          "name": "At home packs",
          "value": "At home packs"
        },
        {
          "name": "At the salon",
          "value": "At the salon"
        }
      ],
      "fn": {
        "if": [
          {
            "!==": [
              {
                "var": "reply"
              },
              "Never"
            ]
          },
          "hair_colouring1",
          "water_type"
        ]
      }
    },
    {
      "id": "hair_colouring1",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "water_type",
      "reply": "",
      "tag": "form",
      "text": "What type of hair color do you use?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Ammonia free color",
          "value": "Ammonia free color"
        },
        {
          "name": "Mehendi or natural colors",
          "value": "Mehendi or natural colors"
        },
        {
          "name": "Global or professional style",
          "value": "Global or professional style"
        },
        {
          "name": "Temporary colors",
          "value": "Temporary colors"
        }
      ]
    },
    {
      "id": "water_type",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "products_used",
      "reply": "",
      "tag": "form",
      "text": "What type of water do you wash your hair with?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Hard water",
          "value": "Hard water"
        },
        {
          "name": "Normal/Good quality water",
          "value": "Normal/Good quality water"
        },
        {
          "name": "Not sure",
          "value": "Not sure"
        }
      ]
    },
    {
      "id": "products_used",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "What all products are you using currently as part of your routine hair care?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Shampoo",
          "value": "Shampoo"
        },
        {
          "name": "Conditioner",
          "value": "Conditioner"
        },
        {
          "name": "Hair masks",
          "value": "Hair masks"
        },
        {
          "name": "Serums or Leave-in creams",
          "value": "Serums or Leave-in creams"
        },
        {
          "name": "Hair oil",
          "value": "Hair oil"
        },
        {
          "name": "Gummies or Suppliments",
          "value": "Gummies or Suppliments"
        }
      ]
    },
    {
      "id": "describe_dandruff_cuticle",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Describe your dandruff.",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No",
          "value": "No"
        },
        {
          "name": "Yes, Mild that comes & goes",
          "value": "Yes, Mild that comes & goes"
        },
        {
          "name": "Yes, Heavy dandruff that sticks to the scalp",
          "value": "Yes, Heavy dandruff that sticks to the scalp"
        },
        {
          "name": "I have Psoriasis",
          "value": "I have Psoriasis",
          "description": "A skin condition that causes red, dry patches on your scalp."
        },
        {
          "name": "I have Sebhoric Dermatitis",
          "value": "I have Sebhoric Dermatitis"
        }
      ]
    },
    {
      "id": "hairFallIntensity",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "hairFallTimeframe",
      "showImages": true,
      "reply": "",
      "tag": "form",
      "text": "How much hairfall do you experience while oiling, combing or washing your hair?",
      "tamil_text": "Hair oil, combing or shampoo use pannumbodhu evlo hair fall face panringa?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Normal hairfall ~20 strands",
          "tamil_name": "Normal hairfall ~ 20 strands",
          "value": "Normal hairfall ~20 strands",
          "image_url": "female_hair_test/oiling/o1.png"
        },
        {
          "name": "I notice a bigger clump than normal ~ 40-50 strands",
          "tamil_name": "Normal'ah vida adhigama notice pannuven ~ 40-50 strands",
          "value": "I notice a bigger clump than normal ~ 40-50 strands",
          "image_url": "female_hair_test/oiling/o2.png"
        },
        {
          "name": "I get very big clumps of hair, more than 100 hair strands",
          "tamil_name": "100 mudiku mela, kotthu kottha kottum",
          "value": "I get very big clumps of hair, more than 100 hair strands",
          "image_url": "female_hair_test/oiling/o3.png"
        }
      ]
    },
    {
      "id": "hairFallTimeframe",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hairLossStage",
      "reply": "",
      "tag": "form",
      "text": "How long have you been experiencing increased hairfall?",
      "tamil_text": "Evlo naala increased hair fall experience panringa?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Less than 6 months",
          "tamil_name": "Less than 6 months",
          "value": "Less than 6 months"
        },
        {
          "name": "6 months to 2 year",
          "tamil_name": "6 months to 2 year",
          "value": "6 months to 2 year"
        },
        {
          "name": "2 year to 5 years",
          "tamil_name": "2 year to 5 years",
          "value": "2 year to 5 years"
        },
        {
          "name": "More than 5 years",
          "tamil_name": "More than 5 years",
          "value": "More than 5 years"
        },
        {
          "name": "Not Applicable",
          "tamil_name": "Not Applicable",
          "value": "Not Applicable"
        }
      ]
    },
    {
      "id": "hairLossStage",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "hairQualityFeelLike",
      "checkSubgroup": true,
      "showImages": true,
      "reply": "",
      "tag": "form",
      "text": "What is your current hair volume like?",
      "tamil_text": "Currently unga mudi adarthi epdi irku?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Hair volume has not changed much",
          "tamil_name": "Hair volume la perusa endha changes'um illa",
          "value": "Hair volume has not changed much",
          "image_url": "female_hair_test/o1.png"
        },
        {
          "name": "Hair volume has reduced, but no thinning in any specific area",
          "tamil_name": "Hair volume koranjiruku, aana endha area'layum thinning ila",
          "value": "Hair volume has reduced, but no thinning in any specific area",
          "image_url": "female_hair_test/o2.png"
        },
        {
          "name": "Hair volume has reduced, with overall thinning",
          "tamil_name": "Hair volume koranjiruku, overall mudi thin aagiruku",
          "value": "Hair volume has reduced, with overall thinning",
          "image_url": "female_hair_test/o3.png"
        },
        {
          "name": "Hair volume has reduced, with front or side thinning",
          "tamil_name": "Hair volume koranjiruku, front and side la thinning irku",
          "value": "Hair volume has reduced, with front or side thinning",
          "image_url": "female_hair_test/o4.png"
        },
        {
          "name": "Middle or Side partition is widening and some scalp is seen",
          "tamil_name": "Partition wide aagudhu, scalp'um konjum theriyudhu",
          "value": "Partition is becoming wider, and some scalp is seen",
          "image_url": "female_hair_test/08.webp"
        },
        {
          "name": "Partition has widened a lot, and scalp is clearly visible",
          "tamil_name": "Partition nalla wide aairuku, scalp'um nalla theriyudhu",
          "value": "Partition has widened a lot, and scalp is clearly visible",
          "image_url": "female_hair_test/11.webp"
        },
        {
          "name": "Seeing coin sized bald patches on my head",
          "tamil_name": "Head la coin sized bald patches irku.",
          "value": "Seeing coin sized bald patches on my head",
          "image_url": "female_hair_test/o7.png"
        }
      ]
    },
    {
      "id": "hairQualityFeelLike",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hairGoalConcern",
      "reply": "",
      "tag": "form",
      "text": "What does your hair feel like, when you touch it?",
      "tamil_text": "Unga mudi, touch pannumbodhu, epdi feel aagudhu?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Split ends",
          "tamil_name": "Hair'la split ends irukku",
          "value": "Split ends"
        },
        {
          "name": "Feels frizzy, dry, or rough to touch",
          "tamil_name": "Frizzy, Dry, and Rough'ah iruku",
          "value": "Feels frizzy, dry, or rough to touch"
        },
        {
          "name": "Breaks easily",
          "tamil_name": "Easy'ah break aagidum",
          "value": "Breaks easily"
        },
        {
          "name": "Sometime Soft/Silky, sometimes Rough/Frizzy",
          "tamil_name": "Sila nerathula silky'ah  irukkum, sila nerathula frizzy illa dry'ah irukkum",
          "value": "Sometime Soft/Silky, sometimes Rough/Frizzy"
        }
      ]
    },
    {
      "id": "hairGoalConcern",
      "component": "inputCheckboxV2",
      "group": "know_your_hair",
      "next": "scalpFeelLike",
      "sub_text": "Select at least one option",
      "reply": "",
      "tag": "form",
      "text": "What are the hair concerns you want to address?",
      "tamil_text": "What are the hair concerns you want to address?",
      "telugu_text": "What are the hair concerns you want to address?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "Reduce dandruff",
          "tamil_name": "Reduce dandruff",
          "telugu_name": "Reduce dandruff",
          "value": "Reduce dandruff",
          "image_url": "female_hair_test/hairGoalConcern/o1.webp"
        },
        {
          "name": "Control hair fall",
          "tamil_name": "Control hair fall",
          "telugu_name": "Control hair fall",
          "value": "Control hair fall",
          "image_url": "female_hair_test/hairGoalConcern/o2.webp"
        },
        {
          "name": "Improve hair thickness/volume/density",
          "tamil_name": "Improve hair thickness/volume/density",
          "telugu_name": "Improve hair thickness/volume/density",
          "value": "Improve hair thickness/volume/density",
          "image_url": "female_hair_test/hairGoalConcern/o3.webp"
        },
        {
          "name": "Hair regrowth",
          "tamil_name": "Hair regrowth",
          "telugu_name": "Hair regrowth",
          "value": "Hair regrowth",
          "image_url": "female_hair_test/hairGoalConcern/o4.webp"
        },
        {
          "name": "Improve hair quality",
          "tamil_name": "Improve hair quality",
          "telugu_name": "Improve hair quality",
          "value": "Improve hair quality",
          "image_url": "female_hair_test/hairGoalConcern/o5.webp"
        },
        {
          "name": "Increase hair length",
          "tamil_name": "Increase hair length",
          "telugu_name": "Increase hair length",
          "value": "Increase hair length",
          "image_url": "female_hair_test/hairGoalConcern/o6.webp"
        }
      ]
    },
    {
      "id": "scalpFeelLike",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "hairTreatment",
      "reply": "",
      "tag": "form",
      "text": "What does your scalp feel like these days?",
      "tamil_text": "What does your scalp feel like these days?",
      "telugu_text": "What does your scalp feel like these days?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Dry",
          "tamil_name": "Dry",
          "telugu_name": "Dry",
          "value": "Dry"
        },
        {
          "name": "Oily",
          "tamil_name": "Oily",
          "telugu_name": "Oily",
          "value": "Oily"
        },
        {
          "name": "Combination (sometimes oily, sometimes dry)",
          "tamil_name": "Combination (sometimes oily, sometimes dry)",
          "telugu_name": "Combination (sometimes oily, sometimes dry)",
          "value": "Combination",
          "description": ""
        },
        {
          "name": "Not Sure",
          "tamil_name": "Not Sure",
          "telugu_name": "Not Sure",
          "value": "Not Sure",
          "description": ""
        }
      ]
    },
    {
      "id": "hairTreatment",
      "component": "inputCheckboxV2",
      "group": "know_your_hair",
      "next": "scalpDandruff",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "What hair treatments have you done in the past 2 years?",
      "tamil_text": "Past 2 years la, enna enna hair treatments laam panirkinga?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None",
          "image_url": ""
        },
        {
          "name": "Smoothening or Straightening treatment",
          "tamil_name": "Smoothening or Straightening treatment",
          "value": "Smoothening or Straightening - Keratin / Nanoplastia/Botox / Cysteine / Rebonding",
          "image_url": "female_hair_test/hairTreatment/o1.webp"
        },
        {
          "name": "Hair repair treatment",
          "tamil_name": "Hair repair treatment",
          "value": "Hair repair treatment - Olaplex / Protein",
          "image_url": "female_hair_test/hairTreatment/o2.webp"
        },
        {
          "name": "Chemical hair coloring",
          "tamil_name": "Chemical hair coloring",
          "value": "Chemical hair coloring - Highlights / full hair / permanent / semi-permanent",
          "image_url": "female_hair_test/hairTreatment/o3.webp"
        },
        {
          "name": "Natural hair coloring",
          "tamil_name": "Natural hair coloring",
          "value": "Natural hair coloring - Henna",
          "image_url": "female_hair_test/hairTreatment/o4.webp"
        },
        {
          "name": "Other hair treatments",
          "tamil_name": "Other hair treatments",
          "value": "Other hair treatments",
          "image_url": ""
        }
      ]
    },
    {
      "id": "scalpDandruff",
      "component": "inputRadio",
      "group": "know_your_hair",
      "next": "hairGenetics",
      "checkSubgroup": true,
      "showImages": true,
      "absoluteImagePath": true,
      "reply": "",
      "tag": "form",
      "text": "What is your experience with dandruff these days?",
      "tamil_text": "Dandruff'oda experience epdi irku?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "No Dandruff at all",
          "tamil_name": "Dandruff illa",
          "value": "No Dandruff at all",
          "image_url": "female_hair_test/scalpDandruff/o1.webp"
        },
        {
          "name": "No Dandruff on wash day, but appears 2-3 days after",
          "tamil_name": "Hair wash day apo dandruff irkadhu, 2-3 days la varum",
          "value": "No Dandruff on wash day, but appears 2-3 days after",
          "image_url": "female_hair_test/scalpDandruff/o2.webp"
        },
        {
          "name": "Always see visible dandruff flakes or powder on hair or shoulder",
          "tamil_name": "Dandruff flakes eppome mudi'layum, shoulder'layum visible ah irkum",
          "value": "Always see visible dandruff flakes or powder around hair or shoulder",
          "image_url": "female_hair_test/scalpDandruff/o3.webp"
        },
        {
          "name": "Scalp is always itchy",
          "tamil_name": "Scalp eppovume itchy'ah irukum, scalp scratch panna nails la sticky dandruff varum.",
          "value": "Scalp is always itchy with sticky dandruff under nails upon scratching",
          "description": "Sticky dandruff under nails upon scratching",
          "image_url": "female_hair_test/scalpDandruff/o4.webp"
        },
        {
          "name": "Persistent red, dry patches on your scalp",
          "tamil_name": "Ungal thalaiyilāna sivappu, ularnda thazhumugal",
          "value": "I have psoriasis or seborrheic dermatitis",
          "image_url": "female_hair_test/scalpDandruff/o5.webp"
        }
      ]
    },
    {
      "id": "hairGenetics",
      "component": "inputRadioV4",
      "group": "know_your_hair",
      "next": "ironLevels",
      "reply": "",
      "tag": "form",
      "text": "Is hair loss a genetic issue in your family?",
      "tamil_text": "Hair loss unga family la genetic issue ah?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes, my mother or mother's side of family",
          "tamil_name": "Yes, my mother or mother's side of family",
          "value": "Yes, my mother or mother's side of family"
        },
        {
          "name": "Yes, my father or father's side of family",
          "tamil_name": "Yes, my father or father's side of family",
          "value": "Yes, my father or father's side of family"
        },
        {
          "name": "Both sides of the family",
          "tamil_name": "Both sides of the family",
          "value": "Both sides of the family"
        },
        {
          "name": "No, not a genetic issue",
          "tamil_name": "No, not a genetic issue",
          "value": "No, not a genetic issue"
        }
      ]
    },
    {
      "id": "healthConditions",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "pcosSelfDiagnosis",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Do you have any of these conditions currently?",
      "tamil_text": "Indha health conditions edhachu ungaluku currently iruka?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Anaemia",
          "tamil_name": "Anaemia",
          "value": "Anaemia"
        },
        {
          "name": "Low Thyroid (Hypo Thyroidism)",
          "tamil_name": "Low Thyroid (Hypo Thyroidism)",
          "value": "Low Thyroid (Hypo Thyroidism)"
        }
      ]
    },
    {
      "id": "ironLevels",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "pcosSelfDiagnosis",
      "reply": "",
      "tag": "form",
      "text": "How have your iron levels been historically?",
      "tamil_text": "Unga iron levels ippo vara history la eppadi irunthuchu?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Low",
          "tamil_name": "Low",
          "value": "Low"
        },
        {
          "name": "Normal",
          "tamil_name": "Normal",
          "value": "Normal"
        },
        {
          "name": "Not sure",
          "tamil_name": "Not sure",
          "value": "Not sure"
        }
      ]
    },
    {
      "id": "pcosSelfDiagnosis",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "femaleLifestage",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Which of these do you tend to experience?",
      "tamil_text": "Idhula edha neenga podhuva experience pannuveenga?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "I have acne located along the jawline or chin",
          "tamil_name": "Enaku jawline or chin'la acne irku",
          "value": "I have acne located along the jawline or chin"
        },
        {
          "name": "I have excessive facial hair",
          "tamil_name": "Enaku excessive facial hair iruku",
          "value": "I have excessive facial hair"
        },
        {
          "name": "I have irregular periods",
          "tamil_name": "Enaku irregular periods iruku",
          "value": "I have irregular periods"
        },
        {
          "name": "Other hormonal issues",
          "tamil_name": "Enaku pcos iruku",
          "value": "Other hormonal issues"
        }
      ]
    },
    {
      "id": "femaleLifestage",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "majorHealthIssue",
      "reply": "",
      "tag": "form",
      "text": "Are you going through any of these life stages currently?",
      "tamil_text": "Idhula irukura life stages edhachu go through panringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Planning to get Pregnant sometime soon",
          "tamil_name": "Pregnancy'ku plan panren",
          "value": "Planning to get Pregnant sometime soon"
        },
        {
          "name": "Currently Pregnant",
          "tamil_name": "Currently Pregnant",
          "value": "Currently Pregnant"
        },
        {
          "name": "My baby is less than 1 year old or I am breastfeeding",
          "tamil_name": "Post pregnancy - Enoda baby ku less than 1 year aagudhu",
          "value": "My baby is less than 1 year old or I am breastfeeding",
          "description": ""
        },
        {
          "name": "I don’t get my periods anymore",
          "tamil_name": "Enaku periods aagradhu illa",
          "value": "Menopause - I don’t get my periods anymore"
        }
      ]
    },
    {
      "id": "majorHealthIssue",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "gutHealth",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "Have you experienced any of these in the last 1 year?",
      "tamil_text": "Idhula edhachu experience paningala last 1 year la?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "I gained or lost a lot of weight",
          "tamil_name": "I gained or lost a lot of weight",
          "value": "I gained or lost a lot of weight"
        },
        {
          "name": "I have undergone a procedure / treatment",
          "tamil_name": "I have undergone a procedure / treatment",
          "value": "I have undergone a procedure / treatment"
        },
        {
          "name": "I moved to a new location or my water supply changed",
          "tamil_name": "I moved to a new location or my water supply changed",
          "value": "I moved to a new location or my water supply changed"
        },
        {
          "name": "My hair is greying",
          "tamil_name": "My hair is greying",
          "value": "My hair is greying"
        }
      ]
    },
    {
      "id": "gutHealth",
      "component": "inputCheckbox",
      "group": "lifestyle_questions",
      "next": "sleepPattern",
      "reply": "",
      "sub_text": "Select at least one option",
      "tag": "form",
      "text": "How is your stomach or digestion these days?",
      "tamil_text": "How is your stomach or digestion these days?",
      "type": "multiple_choice",
      "optionMap": [
        {
          "name": "No issues",
          "tamil_name": "No issues",
          "value": "None"
        },
        {
          "name": "I have acidity or bloating or gas",
          "tamil_name": "I have acidity or bloating or gas",
          "value": "I have acidity or bloating or gas",
          "description": ""
        },
        {
          "name": "I feel constipated",
          "tamil_name": "I feel constipated",
          "value": "I feel constipated",
          "description": ""
        },
        {
          "name": "I have loose motions",
          "tamil_name": "I have loose motions",
          "value": "I have loose motions"
        },
        {
          "name": "I have serious stomach or digestion problems",
          "tamil_name": "I have serious stomach or digestion problems",
          "value": "I have serious stomach or digestion problems"
        }
      ]
    },
    {
      "id": "sleepPattern",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "stressLevels",
      "reply": "",
      "tag": "form",
      "text": "How well do you sleep these days?",
      "tamil_text": "Evlo nalla thoongureenga?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Peacefully for 6-8 hours",
          "tamil_name": "6-8 hours peacefully thoonguven",
          "value": "Peacefully for 6-8 hours"
        },
        {
          "name": "I have difficulty falling asleep",
          "tamil_name": "Thoogradhuku kashta paduven",
          "value": "I have difficulty falling asleep"
        },
        {
          "name": "Disturbed sleep",
          "tamil_name": "Disturbed sleep, atleast oru vaatiyachu thookathula irundhu muzhichiruven",
          "value": "Disturbed sleep, I wake up atleast once a night",
          "description": "I wake up atleast once a night"
        },
        {
          "name": "I sleep for less than 5 hours, as I am very busy",
          "tamil_name": "Less than 5 hours than thoonguven, enoda busy schedule naala.",
          "value": "I sleep for less than 5 hours, as I am very busy"
        },
        {
          "name": "It varies",
          "tamil_name": "It varies- somedays nalla thoonguven, somedays thoongamaten",
          "value": "It varies - somedays I get good sleep, somedays I don't",
          "description": "Somedays I get good sleep, somedays I don't"
        }
      ]
    },
    {
      "id": "stressLevels",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "energyLevels",
      "reply": "",
      "tag": "form",
      "text": "How would you describe your stress level these days?",
      "tamil_text": "Unga stress levels ah epdi describe pannuveenga?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "I feel calm and relaxed most days, with no major worries.",
          "tamil_name": "Mostly calm and relaxed ah irkpen, no major worries.",
          "value": "I feel calm and relaxed most days, with no major worries."
        },
        {
          "name": "I feel tensed 1-2 times a week, but it’s manageable.",
          "tamil_name": "Weekly 1-2 times tensed ah irpen, aana managable thaan.",
          "value": "I feel tensed 1-2 times a week, but it’s manageable."
        },
        {
          "name": "I feel tensed 3-5 times a week, and it affects my mood or focus.",
          "tamil_name": "Weekly 3-5 times tensed ah irpen, en mood or focus'ah adhu affect pannum.",
          "value": "I feel tensed 3-5 times a week, and it affects my mood or focus."
        },
        {
          "name": "I feel tensed almost every day, and it disrupts my sleep or daily life.",
          "tamil_name": "Almost everyday tensed ah irpen, idhu en sleep or daily life'ah disrupt pannum.",
          "value": "I feel tensed almost every day, and it disrupts my sleep or daily life."
        }
      ]
    },
    {
      "id": "energyLevels",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "bloodPressureLevels",
      "reply": "",
      "tag": "form",
      "text": "How would you describe your typical energy during the day?",
      "tamil_text": "Unga energy levels, oru naal la epdi irkum?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "I always feel energetic",
          "tamil_name": "Epome energetic ah feel pannuven",
          "value": "I always feel energetic"
        },
        {
          "name": "Energetic during the day, but low/tired by evening/night",
          "tamil_name": "Day la energetic ah irupen, evening/night pola tired aagiduven",
          "value": "Energetic during the day, but low/tired by evening/night"
        },
        {
          "name": "Low/tired when I wake up, but gradually feel more energetic",
          "tamil_name": "Kaalaila ezhundhirikumbodhu low ah irkum, poga poga energy increase aagum.",
          "value": "Low/tired when I wake up, but gradually feel more energetic"
        },
        {
          "name": "Experience occasional instances of low energy",
          "tamil_name": "Appo appo low energy'ah feel pannuven",
          "value": "Experience occasional instances of low energy"
        },
        {
          "name": "I always feel tired and low on energy",
          "tamil_name": "Eppovume low’ah dhan irkum, tired ah feel pannuven",
          "value": "I always feel tired and low on energy"
        }
      ]
    },
    {
      "id": "bloodPressureLevels",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "supplementsIntake",
      "reply": "",
      "tag": "form",
      "text": "Do you have any of these conditions currently?",
      "tamil_text": "Do you have any of these conditions currently?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "None",
          "tamil_name": "None",
          "value": "None"
        },
        {
          "name": "Low Blood Pressure",
          "tamil_name": "Low Blood Pressure",
          "value": "Low Blood Pressure"
        },
        {
          "name": "High Blood Pressure",
          "tamil_name": "High Blood Pressure",
          "value": "High Blood Pressure"
        }
      ]
    },
    {
      "id": "supplementsIntake",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "dietaryHabits",
      "reply": "",
      "tag": "form",
      "text": "Are you currently taking any supplements or vitamins for hair?",
      "tamil_text": "Currently, hair vitamils or supplements edhachu edukuringala?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "Yes",
          "tamil_name": "Yes",
          "value": "Yes"
        },
        {
          "name": "No",
          "tamil_name": "No",
          "value": "No"
        }
      ]
    },
    {
      "id": "dietaryHabits",
      "component": "inputRadioV4",
      "group": "lifestyle_questions",
      "next": "photo_q",
      "reply": "",
      "tag": "form",
      "text": "Which of the these best describe your Food Habits on most days?",
      "tamil_text": "Which of the these best describe your Food Habits on most days?",
      "type": "single_choice",
      "optionMap": [
        {
          "name": "I mostly eat healthy homely meals, on time",
          "tamil_name": "Mostly, veetu saapadu than sapduven, time la",
          "value": "I mostly eat healthy homely meals, on time"
        },
        {
          "name": "I mostly eat healthy homely food, but often skip meals",
          "tamil_name": "Mostly, veetu saapadu than sapduven, aana meals skip pannuven",
          "value": "I mostly eat healthy homely food, but often skip meals"
        },
        {
          "name": "I often eat junk food",
          "tamil_name": "Junk food sapduven (1 week la 5 times'ku mela)",
          "value": "I often eat junk food (more than 5 times a week)",
          "description": "More than 5 times a week"
        }
      ]
    },
    {
      "id": "cx_comments",
      "component": "InputTextArea",
      "group": "lifestyle_questions",
      "next": null,
      "reply": "",
      "tag": "user",
      "text": "Is there anything additional you'd want to share about your hair concerns?",
      "tamil_text": "Unga hair concerns pathi vera edhavadhu share panna virumbureengala?",
      "telugu_text": "Mee hair concerns gurinchi inkemaina share cheyyalani anukuntunnara?",
      "type": "textarea"
    }
  ]
}