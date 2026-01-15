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

export const RAW_QUIZ_CONFIG: QuizConfig = {
  "questions": [] 
};