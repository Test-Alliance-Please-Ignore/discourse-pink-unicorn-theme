# discourse-pink-unicorn-theme

This Discourse plugin forces a site-wide pink visual treatment and adds animated unicorns drifting across the interface.

## What it does

- Overrides core Discourse color variables with a pink-forward palette.
- Applies soft pink surfaces across headers, sidebars, posts, menus, and modals.
- Injects a fixed overlay of animated unicorns across the whole page.
- Best-effort hides common user theme/color-scheme controls so users cannot easily switch away from the forced look.

## Files

- `plugin.rb`
- `config/settings.yml`
- `config/locales/server.en.yml`
- `assets/stylesheets/common/pink-unicorn-theme.scss`
- `assets/javascripts/discourse/initializers/pink-unicorn-theme.js`

## Install in Discourse

Add the plugin repo to `app.yml`, rebuild, and restart Discourse.

Example:

```yml
hooks:
  after_code:
    - exec:
        cd: $home/plugins
        cmd:
          - git clone https://your.git.host/discourse-pink-unicorn-theme.git
```

## Site settings

- `pink_unicorn_theme_enabled`
- `pink_unicorn_theme_groups`
- `pink_unicorn_theme_unicorn_count`
- `pink_unicorn_theme_animation_speed`

## Notes

- The plugin only applies to logged-in users who are members of one of the groups listed in `pink_unicorn_theme_groups`.
- Group assignment can come from your existing OAuth2-driven Discourse group sync.
- The plugin forces its own visual layer regardless of the user's selected theme.
- Theme preference controls are hidden with a best-effort client-side pass; if your Discourse version uses different preference markup you may want to tune those selectors further.
