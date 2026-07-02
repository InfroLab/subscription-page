import { Group, Text, ThemeIcon } from '@mantine/core'

import { IInfoBlockProps } from './interfaces/props.interface'
import classes from './info-block.module.css'

export const InfoBlockShared = ({ color, icon, title, value }: IInfoBlockProps) => {
    return (
        <Group className={classes.infoBlock} gap="xs" wrap="nowrap">
            <ThemeIcon color={color} radius="sm" size="sm" style={{ flexShrink: 0 }} variant="light">
                {icon}
            </ThemeIcon>
            <Text c="dimmed" size="sm" style={{ flexShrink: 0 }}>
                {title}
            </Text>
            <Text c="white" className={classes.value} fw={600} size="sm" truncate>
                {value}
            </Text>
        </Group>
    )
}
