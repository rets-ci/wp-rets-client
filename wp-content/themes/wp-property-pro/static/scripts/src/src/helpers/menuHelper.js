import { Lib } from 'app_root/lib.jsx';

export const curateMenuItems = (sidebar_menu_items = []) => {
  let items = sidebar_menu_items.map(item => {
    const model = {
      isBordered: false,
      isModal: false,
      isHidden: false,
      icon: null,
      modalId: null,
    };

    model.isBordered = item.classes.find(c => c === 'bordered-bottom') !== undefined;
    model.isHidden = item.classes.find(c => c === 'hidden-by-default') !== undefined;
    const modalClass = item.classes.find(c => c.indexOf(Lib.FORM_MODAL_PREFIX_ACTION) >= 0);
    if (modalClass !== undefined && modalClass.length > Lib.FORM_MODAL_PREFIX_ACTION.length) {
      model.isModal = true;
      model.modalId = modalClass.replace(Lib.FORM_MODAL_PREFIX_ACTION, '');
    }
    const iconClass = item.classes.find(c => c.indexOf('icon-') >= 0);
    model.icon = iconClass ? bundle.static_images_url + iconClass + '.svg' : null;

    return {
      ...model,
      id            : item.ID,
      title         : item.title,
      classes       : item.classes.join(' '),
      relative_url  : item.relative_url,
    };
  });

  const mainItems = items.filter(c => c.isHidden === false);
  const moreItems = items.filter(c => c.isHidden === true);
  const hasMore = moreItems.length > 0;

  return {
    mainItems,
    moreItems,
    hasMore,
  }
};
