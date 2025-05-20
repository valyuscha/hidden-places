import { useController, useFormContext } from 'react-hook-form';
import { allowedTags } from './schema';
import { PlaceFormValues, Tag } from './types';
import s from './styles.module.scss';


export const TagInput = () => {
  const { control } = useFormContext<PlaceFormValues>();

  const {
    field: { value: tags = [], onChange },
    fieldState: { error },
  } = useController<PlaceFormValues, 'tags'>({
    name: 'tags',
    control,
  });

  const toggleTag = (tag: Tag) => {
    if (tags.includes(tag)) {
      onChange(tags.filter(t => t !== tag));
    } else {
      onChange([...tags, tag]);
    }
  };

  return (
    <div className={s.formItem}>
      <label className={s.formLabel}>Tags</label>
      <div className={s.tagOptions}>
        {allowedTags.map(tag => (
          <button
            key={tag}
            type="button"
            className={`${s.tagOption} ${tags.includes(tag) ? s.selected : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
            {tags.includes(tag) && <span className={s.close}>×</span>}
          </button>
        ))}
      </div>
      {error && <p className={s.error}>{error.message}</p>}
    </div>
  );
};
