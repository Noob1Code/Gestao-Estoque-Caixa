INSERT INTO USUARIOS (ID, ATIVO, EMAIL, NOME_COMPLETO, PERFIL, SENHA)
VALUES
    (1, TRUE, 'admin@sistema.com', 'Administrador do Sistema', 'ADMIN', 'senhaAdmin123'),
    (2, TRUE, 'operador@sistema.com', 'Operador Padrão', 'OPERADOR', 'senhaOperador123');

INSERT INTO PRODUTOS
(ID, ATIVO, CATEGORIA, CODIGO, NOME, PRECO_UNITARIO, QUANTIDADE_ESTOQUE)
VALUES
    (1, TRUE, 'Bebida', 'A1B2C3', 'Coca-Cola Lata 350ml', 6.50, 100),
    (2, TRUE, 'Bebida', 'A1B2C4', 'Guaraná 2L', 9.90, 50),
    (3, TRUE, 'Doce', 'D443KD', 'Chocolate Milka', 12.00, 40),
    (4, TRUE, 'Limpeza', 'LP993A', 'Detergente Ypê', 3.50, 200),
    (5, TRUE, 'Higiene', 'HG11TR', 'Sabonete Dove', 5.80, 150);

INSERT INTO VENDAS
(ID, DATA_VENDA, TOTAL, TROCO, VALOR_RECEBIDO, USUARIO_ID)
VALUES
    (1, '2025-11-10 10:15:00', 25.80, 4.20, 30.00, 2),
    (2, '2025-11-10 14:42:12', 31.50, 18.50, 50.00, 2),
    (3, '2025-11-11 09:55:33', 28.30, 1.70, 30.00, 2);

INSERT INTO ITENS_VENDA
(ID, NOME_PRODUTO, PRECO_UNITARIO, QUANTIDADE, PRODUTO_ID, VENDA_ID)
VALUES
-- VENDA 1
(1, 'Coca-Cola Lata 350ml', 6.50, 2, 1, 1),
(2, 'Sabonete Dove', 5.80, 1, 5, 1),

-- VENDA 2
(3, 'Guaraná 2L', 9.90, 1, 2, 2),
(4, 'Chocolate Milka', 12.00, 1, 3, 2),
(5, 'Detergente Ypê', 3.70, 1, 4, 2),
(6, 'Sabonete Dove', 5.80, 1, 5, 2),

-- VENDA 3
(7, 'Guaraná 2L', 9.90, 1, 2, 3),
(8, 'Coca-Cola Lata 350ml', 6.50, 1, 1, 3),
(9, 'Sabonete Dove', 5.80, 1, 5, 3),
(10, 'Detergente Ypê', 3.50, 1, 4, 3),
(11, 'Chocolate Milka', 14.60, 1, 3, 3);

INSERT INTO MOVIMENTOS_ESTOQUE
(ID, MOTIVO, DATA, NOME_PRODUTO, QUANTIDADE, TIPO, PRODUTO_ID, USUARIO_ID)
VALUES
-- VENDA 1
(1, 'Venda ID: 1', '2025-11-10 10:15:00', 'Coca-Cola Lata 350ml', -2, 'SAIDA_VENDA', 1, 2),
(2, 'Venda ID: 1', '2025-11-10 10:15:00', 'Sabonete Dove', -1, 'SAIDA_VENDA', 5, 2),

-- VENDA 2
(3, 'Venda ID: 2', '2025-11-10 14:42:12', 'Guaraná 2L', -1, 'SAIDA_VENDA', 2, 2),
(4, 'Venda ID: 2', '2025-11-10 14:42:12', 'Chocolate Milka', -1, 'SAIDA_VENDA', 3, 2),
(5, 'Venda ID: 2', '2025-11-10 14:42:12', 'Detergente Ypê', -1, 'SAIDA_VENDA', 4, 2),
(6, 'Venda ID: 2', '2025-11-10 14:42:12', 'Sabonete Dove', -1, 'SAIDA_VENDA', 5, 2),

-- VENDA 3
(7, 'Venda ID: 3', '2025-11-11 09:55:33', 'Guaraná 2L', -1, 'SAIDA_VENDA', 2, 2),
(8, 'Venda ID: 3', '2025-11-11 09:55:33', 'Coca-Cola Lata 350ml', -1, 'SAIDA_VENDA', 1, 2),
(9, 'Venda ID: 3', '2025-11-11 09:55:33', 'Sabonete Dove', -1, 'SAIDA_VENDA', 5, 2),
(10, 'Venda ID: 3', '2025-11-11 09:55:33', 'Detergente Ypê', -1, 'SAIDA_VENDA', 4, 2),
(11, 'Venda ID: 3', '2025-11-11 09:55:33', 'Chocolate Milka', -1, 'SAIDA_VENDA', 3, 2);

-- USUARIOS
ALTER TABLE USUARIOS ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM USUARIOS
    );
-- PRODUTOS
ALTER TABLE PRODUTOS ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM PRODUTOS
    );

-- VENDAS
ALTER TABLE VENDAS ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM VENDAS
    );

-- ITENS_VENDA
ALTER TABLE ITENS_VENDA ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM ITENS_VENDA
    );

-- MOVIMENTOS_ESTOQUE
ALTER TABLE MOVIMENTOS_ESTOQUE ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM MOVIMENTOS_ESTOQUE
    );

-- USUARIOS
ALTER TABLE USUARIOS ALTER COLUMN ID RESTART WITH (
SELECT COALESCE(MAX(ID),0) + 1 FROM USUARIOS
    );