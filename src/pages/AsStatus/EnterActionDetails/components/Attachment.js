import { useState } from 'react';
import { downloadFile, getFileName } from '../../../../utils/helpers';

function Attachment({ attachment = [] }) {
  const [isOpenAttachments, setIsOpenAttachments] = useState(true);

  const getKey = index => {
    return index + 1;
  };

  return (
    <div className="attachments">
      <div className="title">
        <h2
          onClick={() => {
            setIsOpenAttachments(!isOpenAttachments);
          }}
        >
          첨부파일
          <i className={!isOpenAttachments ? 'ico-dropdown' : 'ico-dropup'} />
        </h2>
      </div>
      <div className="line" />
      {!isOpenAttachments && (
        <div className="registration-block">
          <div className="registration-number">
            <div className="label-attachment">파일첨부</div>
            <div className="wrapper-field field-attachment">
              <div className="wrapper-files">
                {attachment && attachment.length > 0 ? (
                  attachment.map((file, index) => (
                    <div className="field-items" key={getKey(index)}>
                      <div className="field">
                        <input disabled defaultValue={getFileName(file)} />
                      </div>
                      <div className="attachment">
                        <button onClick={() => downloadFile(file)}>
                          다운로드
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="field">
                    <input disabled defaultValue="" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Attachment;
