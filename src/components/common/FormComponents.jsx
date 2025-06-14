import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20px;
`;

const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    width: ${props => props.$width || '400px'};
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: white;
`;

const FormTitle = styled.h2`
    margin-bottom: 1.5rem;
    color: var(--primary);
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 100%;
`;

const Label = styled.label`
    font-weight: 600;
    margin-bottom: 8px;
    font-size: 1rem;
    color: var(--text);
`;

const baseInputStyles = `
    margin: 8px 0;
    padding: 12px 15px;
    border: 1px solid var(--border);
    border-radius: var(--border-radius);
    font-size: 1rem;
    transition: all 0.3s ease;
    width: 100%;

    &:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 3px var(--primary-light);
    }

    &:hover:not(:disabled) {
        border-color: var(--primary-dark);
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

const Input = styled.input`
    ${baseInputStyles}
`;

const Textarea = styled.textarea`
    ${baseInputStyles}
    font-family: inherit;
    min-height: 100px;
`;

const Select = styled.select`
    ${baseInputStyles}
    background-color: white;
    cursor: pointer;

    &:hover:not(:disabled) {
        border-color: var(--primary);
    }
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: ${props => props.$align || 'flex-end'};
    gap: 10px;
    margin-top: 20px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: ${props => props.$variant === 'secondary' ? 'white' : 'var(--primary)'};
    color: ${props => props.$variant === 'secondary' ? 'var(--primary)' : 'white'};
    border: ${props => props.$variant === 'secondary' ? '1px solid var(--primary)' : 'none'};
    border-radius: var(--border-radius);
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: ${props => props.$variant === 'secondary' ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'};

    &:hover:not(:disabled) {
        background-color: ${props => props.$variant === 'secondary' ? 'rgba(0, 123, 255, 0.1)' : 'var(--primary-dark)'};
        transform: translateY(-1px);
    }

    &:active:not(:disabled) {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.p`
    color: #dc3545;
    font-size: 0.85rem;
    margin: 5px 0;
`;

const SuccessMessage = styled.p`
    color: #28a745;
    font-size: 0.85rem;
    margin: 5px 0;
`;

/**
 * Campo de formulario adaptable que renderiza el tipo de entrada apropiado (input, textarea, select)
 * según el prop 'type' proporcionado. Maneja automáticamente etiquetas, mensajes de error y
 * estados como disabled y required.
 */
const FormField = ({ label, name, type, value, onChange, error, placeholder, disabled, required, options, children, ...rest }) => {
    return (
        <FormGroup>
            {label && <Label htmlFor={name}>{label}{required && ' *'}</Label>}

            {type === 'select' ? (
                <Select
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...rest}
                >
                    {children}
                </Select>
            ) : type === 'textarea' ? (
                <Textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    {...rest}
                />
            ) : (
                <Input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    {...rest}
                />
            )}

            {error && <ErrorMessage>{error}</ErrorMessage>}
        </FormGroup>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    options: PropTypes.array,
    children: PropTypes.node,
};

FormField.defaultProps = {
    type: 'text',
    required: false,
    disabled: false,
};

export {
    FormWrapper,
    FormContainer,
    FormTitle,
    FormGroup,
    Label,
    Input,
    Textarea,
    Select,
    ButtonsContainer,
    Button,
    ErrorMessage,
    SuccessMessage,
    FormField
};
