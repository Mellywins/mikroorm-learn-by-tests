--
-- PostgreSQL database dump
--

-- Dumped from database version 12.12 (Debian 12.12-1.pgdg110+1)
-- Dumped by pg_dump version 12.12 (Debian 12.12-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.book DROP CONSTRAINT book_author_id_fk;
ALTER TABLE ONLY public.author DROP CONSTRAINT id;
ALTER TABLE ONLY public.book DROP CONSTRAINT book_pk;
ALTER TABLE public.book ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.author ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE public.book_id_seq;
DROP TABLE public.book;
DROP SEQUENCE public.author_id_seq;
DROP TABLE public.author;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: root
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO root;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: root
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: author; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.author (
    name character varying(50) NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.author OWNER TO root;

--
-- Name: author_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.author_id_seq
    AS integer
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.author_id_seq OWNER TO root;

--
-- Name: author_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.author_id_seq OWNED BY public.author.id;


--
-- Name: book; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.book (
    id integer NOT NULL,
    title character varying(50) NOT NULL,
    author_id integer NOT NULL
);


ALTER TABLE public.book OWNER TO root;

--
-- Name: book_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.book_id_seq
    AS integer
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.book_id_seq OWNER TO root;

--
-- Name: book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public.book_id_seq OWNED BY public.book.id;


--
-- Name: author id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.author ALTER COLUMN id SET DEFAULT nextval('public.author_id_seq'::regclass);


--
-- Name: book id; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.book ALTER COLUMN id SET DEFAULT nextval('public.book_id_seq'::regclass);


--
-- Data for Name: author; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.author (name, id) FROM stdin;
Author 2	2
Author 1	1
\.


--
-- Data for Name: book; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.book (id, title, author_id) FROM stdin;
2	Book 2	2
1	Book 1	1
3	Book 3	1
\.


--
-- Name: author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.author_id_seq', 14, true);


--
-- Name: book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.book_id_seq', 35, true);


--
-- Name: book book_pk; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_pk PRIMARY KEY (id);


--
-- Name: author id; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.author
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: book book_author_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.book
    ADD CONSTRAINT book_author_id_fk FOREIGN KEY (author_id) REFERENCES public.author(id);


--
-- PostgreSQL database dump complete
--

