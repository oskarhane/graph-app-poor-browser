import neo4j from 'neo4j-driver';

export const reservedTypePropertyName = 'transport-class';

export const applyGraphTypes = (rawItem: any, types = neo4j.types): any => {
    if (rawItem === null || rawItem === undefined) {
        return rawItem;
    } else if (Array.isArray(rawItem)) {
        return rawItem.map(i => applyGraphTypes(i, types));
    } else if (Object.prototype.hasOwnProperty.call(rawItem, reservedTypePropertyName)) {
        const item = {...rawItem};
        const className = item[reservedTypePropertyName];
        const tmpItem = safetlyRemoveObjectProp(item, reservedTypePropertyName);
        switch (className) {
            case 'Node':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(tmpItem.identity, types),
                    tmpItem.labels,
                    applyGraphTypes(tmpItem.properties, types)
                );
            case 'Relationship':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(tmpItem.identity, types),
                    applyGraphTypes(item.start, types),
                    applyGraphTypes(item.end, types),
                    item.type,
                    applyGraphTypes(item.properties, types)
                );
            case 'PathSegment':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.start, types),
                    applyGraphTypes(item.relationship, types),
                    applyGraphTypes(item.end, types)
                );
            case 'Path':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.start, types),
                    applyGraphTypes(item.end, types),
                    item.segments.map((x: any) => applyGraphTypes(x, types))
                );
            case 'Point':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.srid),
                    applyGraphTypes(item.x),
                    applyGraphTypes(item.y),
                    applyGraphTypes(item.z)
                );
            case 'Date':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.year),
                    applyGraphTypes(item.month),
                    applyGraphTypes(item.day)
                );
            case 'DateTime':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.year),
                    applyGraphTypes(item.month),
                    applyGraphTypes(item.day),
                    applyGraphTypes(item.hour),
                    applyGraphTypes(item.minute),
                    applyGraphTypes(item.second),
                    applyGraphTypes(item.nanosecond),
                    applyGraphTypes(item.timeZoneOffsetSeconds),
                    applyGraphTypes(item.timeZoneId)
                );
            case 'Duration':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.months),
                    applyGraphTypes(item.days),
                    applyGraphTypes(item.seconds),
                    applyGraphTypes(item.nanoseconds)
                );
            case 'LocalDateTime':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.year),
                    applyGraphTypes(item.month),
                    applyGraphTypes(item.day),
                    applyGraphTypes(item.hour),
                    applyGraphTypes(item.minute),
                    applyGraphTypes(item.second),
                    applyGraphTypes(item.nanosecond)
                );
            case 'LocalTime':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.hour),
                    applyGraphTypes(item.minute),
                    applyGraphTypes(item.second),
                    applyGraphTypes(item.nanosecond)
                );
            case 'Time':
                // @ts-ignore
                return new types[className](
                    applyGraphTypes(item.hour),
                    applyGraphTypes(item.minute),
                    applyGraphTypes(item.second),
                    applyGraphTypes(item.nanosecond),
                    applyGraphTypes(item.timeZoneOffsetSeconds)
                );
            case 'Integer':
                return neo4j.int(tmpItem);
            default:
                return item;
        }
    } else if (typeof rawItem === 'object') {
        let typedObject = {};
        Object.keys(rawItem).forEach(key => {
            // @ts-ignore
            typedObject[key] = applyGraphTypes(rawItem[key], types);
        });
        typedObject = unEscapeReservedProps(typedObject, reservedTypePropertyName);
        return typedObject;
    } else {
        return rawItem;
    }
};

export const recursivelyTypeGraphItems = (item: any, types = neo4j.types): any => {
    if (item === null || item === undefined) {
        return item;
    }
    if (['number', 'string', 'boolean'].indexOf(typeof item) !== -1) {
        return item;
    }
    if (Array.isArray(item)) {
        return item.map(i => recursivelyTypeGraphItems(i, types));
    }
    // @ts-ignore
    if (item instanceof types.Node) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Node');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.PathSegment) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'PathSegment');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Path) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Path');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Relationship) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Relationship');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Point) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Point');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Date) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Date');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.DateTime) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'DateTime');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Duration) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Duration');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.LocalDateTime) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'LocalDateTime');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.LocalTime) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'LocalTime');
        return tmp;
    }
    // @ts-ignore
    if (item instanceof types.Time) {
        const tmp = copyAndType(item, types);
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Time');
        return tmp;
    }
    if (neo4j.isInt(item)) {
        const tmp = {...item};
        safetlyAddObjectProp(tmp, reservedTypePropertyName, 'Integer');
        return tmp;
    }
    if (typeof item === 'object') {
        // tslint:disable-next-line
        let typedObject = {};
        item = escapeReservedProps(item, reservedTypePropertyName);
        Object.keys(item).forEach(key => {
            // @ts-ignore
            typedObject[key] = recursivelyTypeGraphItems(item[key], types);
        });
        return typedObject;
    }
    return item;
};

function copyAndType(what: any, types = neo4j.types) {
    const keys = Object.keys(what);
    // tslint:disable-next-line
    let tmp = {};
    // @ts-ignore
    keys.forEach(key => (tmp[key] = recursivelyTypeGraphItems(what[key], types)));
    return tmp;
}

export const safetlyAddObjectProp = (obj: any, prop: string, val: any) => {
    obj = escapeReservedProps(obj, prop);
    obj[prop] = val;
    return obj;
};

export const safetlyRemoveObjectProp = (obj: any, prop: string) => {
    if (!hasReservedProp(obj, prop)) {
        return obj;
    }
    delete obj[prop];
    obj = unEscapeReservedProps(obj, prop);
    return obj;
};

export const escapeReservedProps = (obj: any, prop: string) => {
    if (!hasReservedProp(obj, prop)) {
        return obj;
    }
    obj = safetlyAddObjectProp(obj, getEscapedObjectProp(prop), obj[prop]);
    delete obj[prop];
    return obj;
};

export const unEscapeReservedProps = (obj: any, prop: string) => {
    let propName = getEscapedObjectProp(prop);
    if (!hasReservedProp(obj, propName)) {
        return obj;
    }
    while (true) {
        if (!hasReservedProp(obj, propName)) {
            break;
        }
        obj[getUnescapedObjectProp(propName)] = obj[propName];
        delete obj[propName];
        propName = getEscapedObjectProp(propName);
    }
    return obj;
};

const getEscapedObjectProp = (prop: string) => `\\${prop}`;

// A bit weird because of escape chars
const getUnescapedObjectProp = (prop: string) => (prop.indexOf('\\') === 0 ? prop.substr(1) : prop);

export const hasReservedProp = (obj: any, propName: string) => Object.prototype.hasOwnProperty.call(obj, propName);
