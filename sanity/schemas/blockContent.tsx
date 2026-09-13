// Portable Text schema for post bodies (blocks, image, youtube, spacer).
// Also owns BlockContentInput, the custom editor wrapper that pins a YouTube insert button.
import {useEffect, useRef} from 'react'
import {
  defineType,
  defineArrayMember,
  isKeySegment,
  type InputProps,
  type KeyedSegment,
  type PortableTextInputProps,
} from 'sanity'
// @sanity/icons v5: named icons moved to per-icon subpaths; the barrel only exports the lazy map
import {ImageIcon} from '@sanity/icons/Image'
import {PlayIcon} from '@sanity/icons/Play'
import {ExpandIcon} from '@sanity/icons/Expand'
import {Button, Stack} from '@sanity/ui'

// The condensed editor collapses insert buttons into the "..." overflow, so editors had to go
// fullscreen to find YouTube. This pins buttons under the editor that insert after the block the
// cursor was last in (clicking the button blurs the editor, so we remember it), else append.
function BlockContentInput(inputProps: InputProps) {
  const props = inputProps as PortableTextInputProps
  const lastBlock = useRef<KeyedSegment | null>(null)
  const focusedBlock = props.focusPath[0]
  useEffect(() => {
    if (isKeySegment(focusedBlock)) lastBlock.current = focusedBlock
  }, [focusedBlock])
  const append = (value: Record<string, unknown>, open: boolean) => {
    const _key = Math.random().toString(36).slice(2, 14)
    const item = {...value, _key} as never
    if (lastBlock.current) {
      props.onInsert({items: [item], position: 'after', referenceItem: lastBlock.current})
    } else {
      props.onItemAppend(item)
    }
    if (open) props.onItemOpen([...props.path, {_key}])
  }
  return (
    <Stack gap={2}>
      {props.renderDefault(props)}
      <Button
        icon={PlayIcon}
        text="YouTube video"
        mode="ghost"
        onClick={() => append({_type: 'youtube'}, true)}
      />
      {/* No dialog: size has a sane default, and initialValue is skipped on append */}
      <Button
        icon={ExpandIcon}
        text="Spacer"
        mode="ghost"
        onClick={() => append({_type: 'spacer', size: 'medium'}, false)}
      />
    </Stack>
  )
}

/**
 * This is the schema type for block content used in the post document type
 * Importing this type into the studio configuration's `schema` property
 * lets you reuse it in other document types with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */

export default defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  components: {input: BlockContentInput},
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      // Styles let you define what blocks can be marked up as. The default
      // set corresponds with HTML tags, but you can set any title or value
      // you want, and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H1', value: 'h1'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
      // Marks let you mark up inline text in the Portable Text Editor
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url',
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    // icon + title turn this into a labelled button in the editor toolbar; without them it hides
    // in the "insert" overflow menu, which is why nobody could find where to add press shots.
    defineArrayMember({
      type: 'image',
      title: 'Image',
      icon: ImageIcon,
      options: {hotspot: true},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Caption / alt text',
          description:
            'Shown under the image and read by screen readers. Leave empty to use the alt text and credit line saved on the image in the Media library.',
        }
      ]
    }),
    defineArrayMember({
      type: 'object',
      name: 'youtube',
      title: 'YouTube video',
      icon: PlayIcon,
      fields: [
        {
          name: 'url',
          type: 'url',
          title: 'YouTube URL',
          description: 'Paste any watch, youtu.be, or Shorts link.',
          validation: (Rule) => Rule.required(),
        },
      ],
      preview: {
        select: {url: 'url'},
        prepare: ({url}: {url?: string}) => ({title: 'YouTube video', subtitle: url}),
      },
    }),
    defineArrayMember({
      type: 'object',
      name: 'spacer',
      title: 'Spacer',
      icon: ExpandIcon,
      fields: [
        {
          name: 'size',
          type: 'string',
          title: 'Size',
          initialValue: 'medium',
          options: {list: ['small', 'medium', 'large'], layout: 'radio', direction: 'horizontal'},
        },
      ],
      preview: {
        select: {size: 'size'},
        prepare: ({size}: {size?: string}) => ({title: `Spacer (${size || 'medium'})`}),
      },
    }),
  ],
})
