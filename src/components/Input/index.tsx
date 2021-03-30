import {
  useEffect,
  useRef,
  useState,
  useCallback,
  InputHTMLAttributes
} from 'react';

import { IconBaseProps } from 'react-icons'; 

import { useField } from '@unform/core';

import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string; // Como o name geralmente nao e obrigatorio no html normalmente, isso serve para sobrescrever e dizer que é obrigatorio
  icon?: React.ComponentType<IconBaseProps>; // define as propriedades Base do react icons como parametro, para podermos acessar ela no componente logo abaixo.
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const { fieldName, defaultValue, registerField } = useField(name);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputRef.current?.value);
  }, []);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container isFilled={isFilled} isFocused={isFocused}>
      {Icon && <Icon size={20} />}

      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        {...rest}
      />
    </Container>
  );
};

export default Input;
