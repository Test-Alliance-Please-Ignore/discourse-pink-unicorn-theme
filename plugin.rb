# frozen_string_literal: true

# name: discourse-pink-unicorn-theme
# about: Forces a pink unicorn visual treatment across the entire forum
# version: 0.1
# authors: OpenAI

enabled_site_setting :pink_unicorn_theme_enabled

register_asset "stylesheets/common/pink-unicorn-theme.scss"

after_initialize do
  add_to_serializer(:current_user, :pink_unicorn_theme_forced) do
    next false unless SiteSetting.pink_unicorn_theme_enabled

    allowed_groups = SiteSetting.pink_unicorn_theme_groups_map
    next false if allowed_groups.blank?

    object.in_any_groups?(allowed_groups)
  end
end
