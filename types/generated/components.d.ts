import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentImagesGroup extends Schema.Component {
  collectionName: 'components_component_images_groups';
  info: {
    displayName: 'Images Group';
    icon: 'picture';
  };
  attributes: {
    image: Attribute.Media & Attribute.Required;
  };
}

export interface ComponentLink extends Schema.Component {
  collectionName: 'components_component_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    description: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
    isExternal: Attribute.Boolean & Attribute.DefaultTo<false>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'component.images-group': ComponentImagesGroup;
      'component.link': ComponentLink;
    }
  }
}
