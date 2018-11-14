// noinspection ES6UnusedImports
import { h } from 'preact';
import render from 'preact-render-to-json';
import {terms} from '../dummydata';
import DefinitionSection from "../../components/DefinitionSection";
import {createAudioBlobUrl} from "../../util";

function getComponent () {
    return (
        <DefinitionSection
            term={terms[0]}
            translationTerm={terms[0].translations[0]}
        />
    );
}

test('DefinitionSection component', () => {
    global.URL.createObjectURL = jest.fn();
    const tree = render(getComponent());

    expect(tree).toMatchSnapshot();
});
