import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Editor({
  name,
  value,
  style = { backgroundColor: 'white', height: '400px', borderRadius: '10px' },
  onChange,
}) {
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.on('text-change', () => {
        const content = quillRef.current.root.innerHTML;
        onChange(content);
      });
    }
  }, [onChange]);

  return (
    <div style={style}>
      <ReactQuill
        style={{
          backgroundColor: '#fff',
          height: '90%',
        }}
        name={name}
        value={value}
        onChange={onChange}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            // [{ indent: '-1' }, { indent: '+1' }],
            ['image', 'video'], // 'link',
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        }}
        formats={[
          'bold',
          'italic',
          'underline',
          'strike',
          'header',
          'list',
          'bullet',
          // 'indent',
          // 'link',
          'image',
          'video',
          'color',
          'background',
        ]}
        placeholder="내용을 입력해주세요."
      />
    </div>
  );
}

export default Editor;
