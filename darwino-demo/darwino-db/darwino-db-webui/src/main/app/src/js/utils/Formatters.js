import React from "react";

export const UnidFormatter = function(props) {
    const unid = props.row.__meta.unid;
    return <span>{unid}</span>;
}

export const StoreIdFormatter = function(props) {
    const storeId = props.row.__meta.storeId;
    return <span>{storeId}</span>;
}

export const JsonFormatter = function(props) {
    const { __meta, ...json} = {...props.row};
    return <span>{JSON.stringify(json)}</span>;
}