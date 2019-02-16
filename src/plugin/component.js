import { wrappedEditor } from './highOrderComponent';
import VMenu from '@c/Menu/Menu';
import Tinymce from '@c/Tinymce/Tinymce';

export default {
    VMenu,
    VRichEditor: wrappedEditor(Tinymce)
};
