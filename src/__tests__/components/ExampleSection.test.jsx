// noinspection ES6UnusedImports
import {h} from 'preact';
import render from 'preact-render-to-json';
import {terms} from '../dummydata';
import ExampleSection from "../../components/ExampleSection";

function getComponent() {
    return (
        <ExampleSection
            term={terms[0]}
            translationTerm={terms[0].translations[0]}
        />
    );
}

test('ExampleSection component', () => {
    global.URL.createObjectURL = jest.fn();

    const tree = render(getComponent());

    expect(tree).toMatchSnapshot();
});
