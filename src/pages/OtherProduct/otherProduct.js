/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import storeStyles from '../../styles/store/store.module.scss';
import ModalComponent from '../../components/core/modal-base';
import AcceptMethods from '../Store/components/AcceptMethods';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { IndCheckbox } from '../../components/WTable/IndCheckbox';
import Container from '../../components/Container';
import { searchFn } from '../../apis/product.api';
import { useDebounce } from '../../hooks/useDebounce';
import {
  generateNameId,
  formatCost,
  setOnErrorImage,
} from '../../utils/helpers';
import {
  categories,
  designs,
  appServices,
} from '../../constants/jsonData/store';
import Products from '../../components/Products';

function Page() {
  function Style() {
    return (
      <style>
        {`
            .modal-view-detail {
              bottom: 0!important;
              left: 0!important;
              right: 0!important;
              top: auto!important;
              margin-right: 0!important;
              border: none!important;
              box-shadow: none!important;
              padding: 16px!important;
              border-radius: 0px!important;
              padding: 0px!important;
              background: none!important;
              width: 100%!important;
              position: absolute;
              transform: none!important;
              .modal-header{
                padding-bottom: 6.2px!important;
                padding-right: 23.8px!important;
                .modal-close-button {
                  .svg-close{
                    width: 18px;
                  }
                }
              }
            }
            *:focus-visible {
              outline-color: transparent !important;
              outline-style: none !important;
            }
        `}
      </style>
    );
  }
  // const [search, setSearch] = useState('플러스핑거');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [currentTab, setCurrentTab] = useState('전체');
  // const [currentTab, setCurrentTab] = useState(null);
  const [addvanceSearch, setAddvanceSearch] = useState(false);
  const [currentAddvanceSearch, setCurrentAddvanceSearch] =
    useState('출입방식');
  const [isOpen, setIsOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [currentApps, setCurrentApps] = useState([]);
  const [currentDesigns, setCurrentDesigns] = useState([]);
  const [currentAccessMethods, setCurrentAccessMethods] = useState([]);

  const addvanceSearchs = ['출입방식', '디자인', 'App 서비스'];

  const refInput = useRef('');

  // Query data products
  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching: isFetchingData,
  } = useInfiniteQuery(
    [
      'searchKeyinProduct',
      {
        debouncedSearch,
        currentTab,
        // currentApps,
        // currentDesigns,
        // currentAccessMethods,
      },
    ],
    context => {
      return searchFn({
        page: context.pageParam?.page ?? 0,
        search: debouncedSearch,
        brand: '기타',
        category: currentTab === '전체' ? null : currentTab,
        apps: currentApps,
        designs: currentDesigns,
        accessMethods: currentAccessMethods,
      });
    },
    {
      getNextPageParam: lastPage => {
        const hasMore =
          lastPage.metaData.currentPage < lastPage.metaData.totalPages - 1;
        return (
          hasMore && {
            hasMore,
            page: lastPage.metaData.currentPage + 1,
            total: lastPage.metaData.totalPages,
          }
        );
      },
      onSuccess: () => {
        setIsFetching(false);
      },
      onError: () => {
        setIsFetching(false);
      },
    },
  );

  useEffect(() => {
    if (isFetching) {
      refetch();
    }
  }, [currentApps, currentDesigns, currentAccessMethods]);

  const dataLength = useMemo(
    () =>
      data?.pages.reduce((acc, page) => {
        // eslint-disable-next-line no-unsafe-optional-chaining
        return acc + page?.data?.list.length ?? 0;
      }, 0) ?? 0,
    [data],
  );

  const handleKeyDown = event => {
    if (event.keyCode === 13 || event.key === 'Enter') {
      setSearch(event.target.value);
      // refetch();
    }
  };

  const handleClickSearchTerm = () => {
    setSearch(refInput.current.value);
  };

  const handleChangeTabs = value => {
    setCurrentTab(value);
  };

  const handleViewSearchDetail = event => {
    event.preventDefault();
    setAddvanceSearch(!addvanceSearch);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const handleViewSearchDetailMobile = event => {
    event.preventDefault();
    openModal();
  };

  const handleChangeAddvanceSearchTabs = value => {
    setCurrentAddvanceSearch(value);
  };

  const handleChangeApp = (event, screen) => {
    // event.preventDefault();
    if (screen === 'PC') {
      setIsFetching(true);
    }

    const { value, checked } = event.target;
    if (checked) {
      // push selected value in list
      setCurrentApps(prev => [...prev, value]);
    } else {
      // remove unchecked value from the list
      setCurrentApps(prev => prev.filter(pr => pr !== value));
    }
  };

  const handleChangeDesign = (event, screen) => {
    if (screen === 'PC') {
      setIsFetching(true);
    }

    const { value, checked } = event.target;
    if (checked) {
      // push selected value in list
      setCurrentDesigns(prev => [...prev, value]);
    } else {
      // remove unchecked value from the list
      setCurrentDesigns(prev => prev.filter(pr => pr !== value));
    }
  };

  const handleChangeAccessMethod = (event, screen) => {
    if (screen === 'PC') {
      setIsFetching(true);
    }

    const { value, checked } = event.target;
    if (checked) {
      // push selected value in list
      setCurrentAccessMethods(prev => [...prev, value]);
    } else {
      // remove unchecked value from the list
      setCurrentAccessMethods(prev => prev.filter(pr => pr !== value));
    }
  };

  const changeStyles = value => {
    let style = null;
    switch (value) {
      case '지문인식':
        style = {
          marginBottom: '10.5px',
        };
        break;
      case '스마트카드키':
        style = {
          marginBottom: '8.5px',
        };
        break;
      case '스틱키':
        style = {
          marginTop: '9.5px',
          marginBottom: '9.5px',
        };
        break;
      case '스마트폰':
      case '스마트폰 App':
        style = {
          marginTop: '9.5px',
          marginBottom: '9.5px',
        };
        break;
      case '기계식키':
        style = {
          marginTop: '9.5px',
          marginBottom: '8.5px',
        };
        break;
      default:
        break;
    }
    return style;
  };

  const handleAdvanceSeacrchMO = event => {
    event.preventDefault();
    closeModal();
    refetch();
  };

  const { width } = useWindowDimensions();

  return (
    <div>
      <Style />
      <Container className={`${storeStyles.container}`}>
        <div className={storeStyles['keyin-header']}>
          <span>기타 상품</span>
        </div>
        <div className={storeStyles['keyin-search']}>
          <div className={storeStyles.search}>
            <input
              className={storeStyles['input-search']}
              placeholder="제품명을 입력해주세요."
              onKeyDown={handleKeyDown}
              defaultValue={refInput.current.value}
              ref={refInput}
            />
            <button onClick={handleClickSearchTerm}>
              <img src="/assets/icons/search.png" alt="Search" />
            </button>
          </div>
        </div>
        <div className={storeStyles['keyin-tags']}>
          <div className={storeStyles.tags}>
            {categories?.map(t => {
              return (
                <button
                  key={t.value}
                  className={`${storeStyles.frame} ${
                    t.value === currentTab ? storeStyles.active : ''
                  }`}
                  onClick={() => handleChangeTabs(t.value)}
                >
                  <span>{t.text}</span>
                </button>
              );
            })}
          </div>
          <button
            className={storeStyles['search-detail']}
            onClick={handleViewSearchDetail}
          >
            상세검색
            <img src="/assets/arrow/down.png" alt="search-detail" />
          </button>
          <button
            className={storeStyles['search-detail-mobile']}
            onClick={handleViewSearchDetailMobile}
          >
            <img src="/assets/icons/view-m.svg" alt="search-detail-mobile" />
          </button>
        </div>
        {width > 600 && (
          <div
            className={`${storeStyles['keyin-search-detail']} ${
              addvanceSearch === true
                ? storeStyles['keyin-show-search-detail']
                : ''
            }`}
          >
            <div className={storeStyles['access-method']}>
              <div className={storeStyles.label}>
                <span>출입방식</span>
              </div>
              <div className={storeStyles.options}>
                <AcceptMethods
                  deviceName="PC"
                  currentAccessMethods={currentAccessMethods}
                  handleChangeAccessMethod={event =>
                    handleChangeAccessMethod(event, 'PC')
                  }
                />
              </div>
            </div>
            <hr />
            <div className={storeStyles['access-method']}>
              <div className={storeStyles.label}>
                <span>디자인</span>
              </div>
              <div className={storeStyles.options}>
                {designs?.map(m => {
                  return (
                    <div key={m.value} className={storeStyles.checkbox}>
                      <input
                        type="checkbox"
                        id={m.value}
                        name={m.value}
                        value={m.value}
                        onChange={event => handleChangeDesign(event, 'PC')}
                      />
                      <label htmlFor={m.value}>{m.text}</label>
                    </div>
                  );
                })}
              </div>
            </div>
            <hr />
            <div className={storeStyles['access-method']}>
              <div className={storeStyles.label}>
                <span>App 서비스</span>
              </div>
              <div className={storeStyles.options}>
                {appServices?.map(m => {
                  return (
                    <div key={m.value} className={storeStyles.checkbox}>
                      <input
                        type="checkbox"
                        id={m.value}
                        name={m.value}
                        value={m.value}
                        onChange={event => handleChangeApp(event, 'PC')}
                      />
                      <label htmlFor={m.value}>{m.text}</label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className={storeStyles['keyin-products']}>
          <Products
            dataLength={dataLength}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            data={data}
            isFetchingData={isFetchingData}
          />
        </div>
      </Container>
      <ModalComponent
        isOpen={isOpen}
        closeModal={closeModal}
        className="modal-view-detail"
        closeColor="#FFFFFF"
      >
        <div className={storeStyles['option-tabs-view']}>
          <div className={storeStyles['option-tabs-header']}>
            {addvanceSearchs?.map(s => {
              return (
                <button
                  key={s}
                  className={`${
                    s === currentAddvanceSearch ? storeStyles.active : ''
                  }`}
                  onClick={() => handleChangeAddvanceSearchTabs(s)}
                >
                  <span>{s}</span>
                </button>
              );
            })}
          </div>
          <div className={storeStyles['option-tabs-list']}>
            <div className={storeStyles.options}>
              <div
                id="출입방식"
                style={
                  currentAddvanceSearch === '출입방식'
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                <AcceptMethods
                  changeStyles={changeStyles}
                  isShownHr
                  deviceName="MO"
                  currentAccessMethods={currentAccessMethods}
                  handleChangeAccessMethod={event =>
                    handleChangeAccessMethod(event, 'MO')
                  }
                />
              </div>
              <div
                id="디자인"
                style={
                  currentAddvanceSearch === '디자인'
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                {designs?.map(m => {
                  return (
                    <div key={m.value}>
                      <div className={storeStyles.checkbox}>
                        <input
                          type="checkbox"
                          id={`${m.value} - MO`}
                          name={m.value}
                          value={m.value}
                          defaultChecked={currentDesigns.includes(m.value)}
                          onChange={event => handleChangeDesign(event, 'MO')}
                        />
                        <label htmlFor={`${m.value} - MO`}>{m.text}</label>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
              <div
                id="App서비스"
                style={
                  currentAddvanceSearch === 'App 서비스'
                    ? { display: 'block' }
                    : { display: 'none' }
                }
              >
                {appServices?.map(m => {
                  return (
                    <div key={m.value}>
                      <div className={storeStyles.checkbox}>
                        <input
                          type="checkbox"
                          id={`${m.value} - MO`}
                          name={m.value}
                          value={m.value}
                          defaultChecked={currentApps.includes(m.value)}
                          onChange={event => handleChangeApp(event, 'MO')}
                        />
                        <label htmlFor={`${m.value} - MO`}>{m.text}</label>
                      </div>
                      <hr />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            className={storeStyles['button-check']}
            onClick={handleAdvanceSeacrchMO}
          >
            확인
          </button>
        </div>
      </ModalComponent>
    </div>
  );
}

export default Page;
