import jp from "jsonpath";
import yaml from "js-yaml";

export default class Converter {
    getChannels(yamlSchema) {
        const asyncJson = yaml.safeLoad(yamlSchema);
        let channels = jp.value(asyncJson, "$.channels");
        if (typeof channels !== 'object') {
            return;
        }

        return Object.keys(channels);
    }

    convert(yamlSchema, channel) {
        const asyncJson = yaml.safeLoad(yamlSchema);
        let refPath = jp.value(asyncJson, "$.channels..['" + channel + "']..message..['$ref']").substring(2).replace(/\//g, '.');
        let objectRefPath = jp.value(asyncJson, '$.' + refPath + '.payload..["$ref"]').substring(2).replace(/\//g, '.');
        let object = jp.value(asyncJson, '$.' + objectRefPath);
        return this.replaceRefs(object, asyncJson);
    }

    replaceRefs(object, schema) {
        let entries = Object.entries(object).map((value) => {
            let key = value[0];
            value = value[1];
            if (typeof value === 'object' && !Array.isArray(value)) {
                if ('$ref' in value) {
                    let path = value['$ref'].substring(2).replace(/\//g, '.');
                    value = jp.value(schema, '$.' + path);
                }

                value = this.replaceRefs(value, schema);
            }

            return [key, value];
        });

        return Object.fromEntries(entries);
    }
}
