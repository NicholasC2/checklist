import { Schema, model, models } from "mongoose";

export enum CheckType {
    Multi = "multi",
    Single = "single"
}

interface Files {
    enabled: boolean;
    acceptedTypes?: string[];
}

interface BaseCheck {
    type: CheckType;
    name: string;
    requirements?: string;
    files?: Files;
}

interface SingleCheck extends BaseCheck {
    type: CheckType.Single;
    checked: boolean;
    subChecks?: never;
}

interface MultiCheck extends BaseCheck {
    type: CheckType.Multi;
    checked?: never;
    subChecks: {
        name: string;
        checked: boolean;
        files?: Files;
    }[];
}

export type CheckDocument = SingleCheck | MultiCheck;

const filesSchema = new Schema<Files>({
    enabled: {
        type: Boolean,
        default: false,
    },
    acceptedTypes: {
        type: [String],
        default: [],
    },
}, { _id: false });

const subCheckSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    files: {
        type: filesSchema,
        default: undefined,
    },
}, { _id: false });

const checkSchema = new Schema({
    type: {
        type: String,
        enum: Object.values(CheckType),
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    requirements: {
        type: String,
        trim: true,
    },

    files: {
        type: filesSchema,
        default: undefined,
    },

    checked: {
        type: Boolean,
        required: function () {
            return this.type === CheckType.Single;
        },
    },

    subChecks: {
        type: [subCheckSchema],
        required: function () {
            return this.type === CheckType.Multi;
        },
    },
}, {
    timestamps: true,
});

const Check = models.Check || model("Check", checkSchema);

export default Check;
