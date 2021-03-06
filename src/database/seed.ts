import {TeamMemberRoleIdentifiers} from "./TeamMemberRoleIdentifiers";

export const data = {
    "roles": [
        {
            "_id": TeamMemberRoleIdentifiers.Member,
            "name": "Member",
            "canManageTeam": false,
            "canManageRetrospective": false,
            "canViewMemberInsights": false
        },
        {
            "_id": TeamMemberRoleIdentifiers.Manager,
            "name": "Manager",
            "canManageTeam": false,
            "canManageRetrospective": false,
            "canViewMemberInsights": true
        },
        {
            "_id": TeamMemberRoleIdentifiers.ScrumMaster,
            "name": "Scrum master",
            "canManageTeam": false,
            "canManageRetrospective": true,
            "canViewMemberInsights": true
        },
        {
            "_id":  TeamMemberRoleIdentifiers.Admin,
            "name": "Admin",
            "canManageTeam": true,
            "canManageRetrospective": true,
            "canViewMemberInsights": true
        }
    ],
    "commentCategories": [
        {
            "name": "Good",
            "description": "Good",
            "iconLabel": "+",
            "iconColor": "#4AE6AA",
            "minimalCommentCount": 1
        },
        {
            "name": "Improvement",
            "description": "Room for improvement",
            "iconLabel": "~",
            "iconColor": "#D67F28",
            "minimalCommentCount": 1
        },
        {
            "name": "ThinkingAbout",
            "description": "Thinking about",
            "iconLabel": "I",
            "iconColor": "#4A92E6",
            "minimalCommentCount": 0
        }
    ],
    "timeUsageCategories": [
        {
            "name": "Meetings",
            "color": "#4A92E6",
            "initialPercentage": 20,
            "increaseIsPositive": false
        },
        {
            "name": "Focus",
            "color": "#4AE6AA",
            "initialPercentage": 60,
            "increaseIsPositive": true
        },
        {
            "name": "Disturbance",
            "color": "#BC4767",
            "initialPercentage": 20,
            "increaseIsPositive": false
        }
    ]
}
