import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import './SchemaBuilder.css'; // Import your CSS file

const { Option } = Select;

const SchemaBuilder = () => {
  const [schemaData, setSchemaData] = useState([]);

  const renderNestedSchema = (nestedSchema, parentIndex) => {
    return nestedSchema.map((field, index) => (
      <div key={index} className="field-box">
        <Form.Item label="Key">
          <Input
            value={field.key}
            onChange={(e) => handleNestedFieldKeyChange(e, parentIndex, index)}
          />
        </Form.Item>
        <Form.Item label="Value">
          <Input
            value={field.value}
            onChange={(e) => handleNestedFieldValueChange(e, parentIndex, index)}
          />
        </Form.Item>
        <Form.Item label="Type">
          <Select
            value={field.type}
            onChange={(value) => handleNestedFieldTypeChange(value, parentIndex, index)}
          >
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="nested">Nested</Option>
          </Select>
        </Form.Item>
        {field.type === 'nested' && (
          <div className="nested-field">
            {renderNestedSchema(field.nested, parentIndex)}
            <Button onClick={() => addNestedField(parentIndex)}>+ Add Nested Field</Button>
          </div>
        )}
        <Button onClick={() => deleteNestedField(parentIndex, index)} className="delete-button">
          Delete
        </Button>
      </div>
    ));
  };

  const renderSchema = () => {
    return schemaData.map((field, index) => (
      <div key={index} className="field-box">
        <Form.Item label="Key">
          <Input
            value={field.key}
            onChange={(e) => handleFieldKeyChange(e, index)}
          />
        </Form.Item>
        <Form.Item label="Value">
          <Input
            value={field.value}
            onChange={(e) => handleFieldValueChange(e, index)}
          />
        </Form.Item>
        <Form.Item label="Type">
          <Select
            value={field.type}
            onChange={(value) => handleFieldTypeChange(value, index)}
          >
            <Option value="string">String</Option>
            <Option value="number">Number</Option>
            <Option value="nested">Nested</Option>
          </Select>
        </Form.Item>
        {field.type === 'nested' && (
          <div className="nested-field">
            {renderNestedSchema(field.nested, index)}
            <Button onClick={() => addNestedField(index)}>+ Add Nested Field</Button>
          </div>
        )}
        <Button onClick={() => deleteField(index)} className="delete-button">
          Delete
        </Button>
      </div>
    ));
  };

  const handleFieldKeyChange = (e, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[index].key = e.target.value;
    setSchemaData(updatedSchema);
  };

  const handleFieldValueChange = (e, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[index].value = e.target.value;
    setSchemaData(updatedSchema);
  };

  const handleFieldTypeChange = (value, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[index].type = value;
    updatedSchema[index].nested = []; // Clear nested fields when changing type
    setSchemaData(updatedSchema);
  };

  const handleNestedFieldKeyChange = (e, parentIndex, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[parentIndex].nested[index].key = e.target.value;
    setSchemaData(updatedSchema);
  };

  const handleNestedFieldValueChange = (e, parentIndex, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[parentIndex].nested[index].value = e.target.value;
    setSchemaData(updatedSchema);
  };

  const handleNestedFieldTypeChange = (value, parentIndex, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[parentIndex].nested[index].type = value;
    updatedSchema[parentIndex].nested[index].nested = []; // Clear nested fields when changing type
    setSchemaData(updatedSchema);
  };

  const addField = () => {
    setSchemaData([...schemaData, { key: '', value: '', type: 'string', nested: [] }]);
  };

  const addNestedField = (parentIndex) => {
    const updatedSchema = [...schemaData];
    updatedSchema[parentIndex].nested.push({ key: '', value: '', type: 'string', nested: [] });
    setSchemaData(updatedSchema);
  };

  const deleteField = (index) => {
    const updatedSchema = [...schemaData];
    updatedSchema.splice(index, 1);
    setSchemaData(updatedSchema);
  };

  const deleteNestedField = (parentIndex, index) => {
    const updatedSchema = [...schemaData];
    updatedSchema[parentIndex].nested.splice(index, 1);
    setSchemaData(updatedSchema);
  };

  return (
    <div className="container">
      <div className="flex-container">
        <div className="input-section">
          <h2>Input Fields</h2>
          <div className="input-fields">
            {renderSchema()}
            <Button onClick={addField} className="add-button">
              + Add Field
            </Button>
          </div>
        </div>
        <div className="result-section">
          <h2>Result</h2>
          <div className="json-preview">
            <pre>{JSON.stringify(convertToKeyValueSchema(schemaData), null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

const convertToKeyValueSchema = (schemaData) => {
  const keyValueSchema = {};
  schemaData.forEach((field) => {
    if (field.type === 'nested') {
      keyValueSchema[field.key] = convertToKeyValueSchema(field.nested);
    } else {
      keyValueSchema[field.key] = field.value;
    }
  });
  return keyValueSchema;
};

export default SchemaBuilder;
