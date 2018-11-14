// noinspection ES6UnusedImports
import { h } from 'preact';
import render from 'preact-render-to-json';
import {terms} from '../dummydata';
import Footer from "../../components/Footer";

const translations = terms[0].translations;

function getComponent () {
    return (
        <Footer
            translations={translations}
            language={terms[0].language}
            currentTranslationId={translations[0].id}
        />
    );
}

test('Footer component', () => {
    const tree = render(getComponent());

    expect(tree).toMatchSnapshot();
});
