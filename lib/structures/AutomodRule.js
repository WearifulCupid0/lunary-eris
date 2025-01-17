"use strict";

const Base = require("./Base");

/**
 * Represents an automod role
 * @prop {Object} guild The guild which the automod rule belongs to
 * @prop {String} name The rule name
 * @prop {String} creatorID The user which first created this rule
 * @prop {Number} eventType The rule event type
 * @prop {Number} triggerType The rule trigger type
 * @prop {Array<String>?} keywordFilter Substrings which will be searched for in content
 * @prop {Array<Number>?} presets The internally pre-defined wordsets which will be searched for in content
 * @prop {Array<String>?} allowList Substrings which will be exempt from triggering the preset trigger type
 * @prop {Array<Object>} actions The actions which will execute when the rule is triggered
 * @prop {Boolean?} enabled Whether the rule is enabled
 * @prop {Array<String>?} exemptRoles The role ids that should not be affected by the rule
 * @prop {Array<String>?} exemptChannels The channel ids that should not be affected by the rule
 */
class AutomodRule extends Base {
    constructor (data, client) {
        super(data.id);

        this._client = client;
        this.guild = client.guilds.get(data.guild_id) || {id:data.guild_id};
        this.creatorID = data.creator_id;
        this.update(data);
    }
    update(data) {
        if(data.name !== undefined) {
            this.name = data.name;
        }
        if(data.event_type !== undefined) {
            this.eventType = data.event_type;
        }
        if(data.trigger_type !== undefined) {
            this.triggerType = data.trigger_type;
        }
        if(typeof data.trigger_metadata === "object") {
            this.keywordFilter = data.trigger_metadata.keyword_filter;
            this.presets = data.trigger_metadata.presets;
            this.allowList = data.trigger_metadata.allow_list;
        }
        if(Array.isArray(data.actions)) {
            this.actions = data.actions.map((action) => AutomodRule._formatAction(action));
        }
        if(data.enabled !== undefined) {
            this.enabled = data.enabled;
        }
        if(data.exempt_roles !== undefined) {
            this.exemptRoles = data.exempt_roles;
        }
        if(data.exempt_channels !== undefined) {
            this.exemptChannels = data.exempt_channels;
        }
    }
    /**
     * Delete the automod rule
     * @returns {Promise}
     */
    delete() {
        return this._client.deleteAutomodRule.call(this._client, this.guild.id, this.id);
    }
    /**
     * Edit the automod rule
     * @param {Object} options Options to edit
     * @returns {Promise<AutomodRule>}
     */
    edit(options) {
        return this._client.editAutomodRule.call(this._client, this.guild.id, this.id, options);
    }
    static _formatAction(action) {
        const obj = {
            type: action.type
        };
        if(typeof action.metadata === "object") {
            obj.channelID = action.metadata.channel_id;
            obj.durationSeconds = action.metadata.duration_seconds;
        }
        return obj;
    }
}

module.exports = AutomodRule;
