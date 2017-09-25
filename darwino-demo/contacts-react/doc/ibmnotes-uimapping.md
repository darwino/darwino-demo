# Mapping IBM Notes UI constructs to ReactJS and Darwino
--------------------------------------------------------


## Attachment List ##
The list of attachments can be displayed using a dedicated component. The field property is the name of the rich text field owning the attachments

    <AttachmentTable {...this.props} field='documents'/>

## Computed subforms ##
Each subform should be defined as its own React component. There should also be a dispatcher component that will render the proper dynamic component based on a parameter. The dispatcher should import all the components that could be rendered.
The form then simply create a dispatcher and calculate the name of the subform in its name property:

    <Panel collapsible defaultExpanded header="Address">
    	<ComputedComponent name="CCAddress" {...this.props}/>
    </Panel>

See: [ComputedComponents.jsx](../contacts-react-webui/src/main/app/js/pages/app/ComputedComponent.jsx )

## Embedded View ##

A CursorGrid can be embedded anywhere in a page (form). Its parentid parameter can be set to the current document, to only select the responses of the current document.

    <CursorGrid
    	databaseId={Constants.DATABASE}
    	params={{
    		name: "AllCompanyDocuments",
    		parentid: this.props.unid,
    	...

